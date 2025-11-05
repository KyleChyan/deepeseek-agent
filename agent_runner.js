// agent_runner.js (V4 - result.json 位于 PROJECT_ROOT, 集成重试逻辑)

import { OpenAI } from 'openai';
import * as fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import 'dotenv/config';
import fetch from 'node-fetch';

// --- 配置常量（从 .env 读取） ---
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-coder';
const PROJECT_ROOT = process.env.PROJECT_ROOT;
const AGENT_WORK_SUBDIR = process.env.AGENT_WORK_SUBDIR;
const TASK_FILE_NAME = process.env.TASK_FILE_NAME;
const RESULT_FILE_NAME = process.env.RESULT_FILE_NAME || 'result.json';
const MAX_ITERATIONS = parseInt(process.env.MAX_ITERATIONS) || 10;

// 派生路径
const AGENT_WORK_DIR = path.join(PROJECT_ROOT, AGENT_WORK_SUBDIR);
const TASK_FILE = path.join(PROJECT_ROOT, TASK_FILE_NAME);
const RESULT_ABSOLUTE_PATH = path.join(PROJECT_ROOT, RESULT_FILE_NAME);

const execPromise = promisify(exec);

// ----------------------------------------------------
// I. 初始化 DeepSeek 客户端
// ----------------------------------------------------
const deepseek = new OpenAI({
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY,
    fetch: fetch,
});

// ----------------------------------------------------
// II. Agent 工具函数 (Function Calling)
// ----------------------------------------------------

function resolvePath(filePath) {
    const fullPath = path.resolve(AGENT_WORK_DIR, filePath);

    // 安全检查：确保路径不会逃逸到 AGENT_WORK_DIR 之外
    if (!fullPath.startsWith(AGENT_WORK_DIR)) {
        throw new Error(`Agent 只能访问 ${AGENT_WORK_DIR} 内部的文件。请检查相对路径。`);
    }
    return fullPath;
}

const toolFunctions = {
    /** 读取指定路径的文件内容 */
    read_file: async (filePath) => {
        try {
            const fullPath = resolvePath(filePath);
            const content = await fs.readFile(fullPath, 'utf-8');
            return `文件 '${filePath}' 内容:\n${content.substring(0, 3000)}... (截断超过3KB的内容)`;
        } catch (error) {
            return `错误: 无法读取文件 ${filePath}。请确认路径是否正确。错误信息: ${error.message}`;
        }
    },

    /** 写入内容到指定路径的文件，如果文件不存在则创建 */
    write_file: async (filePath, content) => {
        try {
            const fullPath = resolvePath(filePath);
            await fs.writeFile(fullPath, content, 'utf-8');
            return `成功写入文件: ${filePath}`;
        } catch (error) {
            return `错误: 无法写入文件 ${filePath}。错误信息: ${error.message}`;
        }
    },

    /** 在终端执行一个 Shell 命令 */
    execute_shell_command: async (command) => {
        try {
            // 命令在 AGENT_WORK_DIR (即项目/doc) 中执行
            const { stdout, stderr } = await execPromise(command, { cwd: AGENT_WORK_DIR, timeout: 60000 });
            if (stderr) {
                return `命令 '${command}' 执行完毕。但有标准错误输出 (stderr):\n${stderr}\n标准输出 (stdout):\n${stdout}`;
            }
            return `命令 '${command}' 执行成功。输出:\n${stdout.substring(0, 3000)}... (截断超过3KB的内容)`;
        } catch (error) {
            return `命令 '${command}' 执行失败。错误信息: ${error.message}\n${error.stderr}`;
        }
    },

    /** 递归列出指定目录下的文件和文件夹 */
    list_directory: async (dirPath = '.') => {
        try {
            const fullPath = resolvePath(dirPath);
            const files = await fs.readdir(fullPath, { recursive: true });

            const filteredFiles = files.filter(f => !path.basename(f).startsWith('.'));

            return `目录 '${dirPath}' (即 ${AGENT_WORK_DIR}) 结构:\n${filteredFiles.join('\n')}`;
        } catch (error) {
            return `错误: 无法列出目录 ${dirPath}。请确认路径是否正确。错误信息: ${error.message}`;
        }
    }
};

// ----------------------------------------------------
// III. Tool Schema Definition (提供给 DeepSeek)
// ----------------------------------------------------
const tools = [
    {
        type: "function",
        function: {
            name: "read_file",
            description: "读取指定路径的文件内容。所有路径必须是相对于 Agent 工作目录的相对路径。",
            parameters: {
                type: "object",
                properties: {
                    filePath: { type: "string", description: "相对于 Agent 工作目录的文件路径 (如 mars-admin/index.js)" },
                },
                required: ["filePath"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "write_file",
            description: "向指定路径的文件写入新内容。只有在确定了正确的修改方案后才能使用此工具。",
            parameters: {
                type: "object",
                properties: {
                    filePath: { type: "string", description: "相对于 Agent 工作目录的文件路径。" },
                    content: { type: "string", description: "要写入文件的完整新内容。" },
                },
                required: ["filePath", "content"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "execute_shell_command",
            description: "在项目工作目录中执行 shell 命令，例如安装依赖 (npm install) 或运行测试。",
            parameters: {
                type: "object",
                properties: {
                    command: { type: "string", description: "要执行的命令字符串。" },
                },
                required: ["command"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "list_directory",
            description: "列出项目工作目录结构，用于定位文件。",
            parameters: {
                type: "object",
                properties: {
                    dirPath: { type: "string", description: "要列出的目录的相对路径，默认为 '.' (工作目录)" },
                },
                required: [],
            },
        },
    }
];

// ----------------------------------------------------
// IV. Agent 核心执行逻辑
// ----------------------------------------------------

async function runDeepSeekAgent(userTask) {
    if (!process.env.DEEPSEEK_API_KEY) {
        throw new Error("配置错误：请在 .env 文件中设置 DEEPSEEK_API_KEY。");
    }

    let messages = [
        {
            role: "system",
            content: `你是一个自主 Agent，你的目标是完成用户提供的任务。
- 你的**工作目录** (即可操作的文件根目录) 是: ${AGENT_WORK_DIR}。
- 所有文件路径都是相对于这个目录的。
- 任务要求已从 ${TASK_FILE_NAME} 中读取，内容如下: 
---
${userTask}
---
- 你必须使用提供的工具来读取、修改文件和执行命令。
- 在给出最终答案之前，必须先用工具完成任务。
- **任务完成后，你必须返回一个最终的总结性的自然语言回答，不要再调用工具。**
- 思考时，请一步步分解任务。
`,
        },
        { role: "user", content: "Agent 启动成功。请开始分析任务并执行第一步操作。" },
    ];

    let finalResult = { status: "running", output: "Agent 正在执行中...", steps: [] };

    try {
        for (let i = 0; i < MAX_ITERATIONS; i++) {
            console.log(`\n--- 第 ${i + 1} 轮迭代 (Max: ${MAX_ITERATIONS}) ---`);
            process.stdout.write(`Agent 正在思考...`);

            // ******************************************************
            // <<-- 容错重试逻辑开始 (新增/修改) -->>
            // ******************************************************
            let response;
            const MAX_RETRIES = 3; // 最大重试次数
            for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
                try {
                    response = await deepseek.chat.completions.create({
                        model: DEEPSEEK_MODEL,
                        messages: messages,
                        tools: tools,
                        tool_choice: "auto",
                        // 增加超时时间，以防网络延迟
                        timeout: 60000,
                    });
                    // 成功获取响应，跳出重试循环
                    break;
                } catch (error) {
                    // 专门捕获 JSON 解析失败或网络/连接错误
                    if (error.message.includes('Unexpected end of JSON input') || error.message.includes('FetchError') || error.message.includes('timeout')) {
                        if (attempt < MAX_RETRIES - 1) {
                            console.warn(`\n[警告] API 发生连接/JSON错误，进行第 ${attempt + 1} 次重试...`);
                            // 指数退避等待：2s, 4s, 6s...
                            await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
                            continue;
                        } else {
                            // 超过最大重试次数，抛出致命错误
                            throw new Error(`API 调用失败: 达到最大重试次数。原始错误: ${error.message}`);
                        }
                    } else {
                        // 其他非重试错误（如 402 Insufficient Balance, 401 Unauthorized）直接抛出
                        throw error;
                    }
                }
            }

            // 确保 response 存在（如果重试成功，response会被赋值）
            if (!response) {
                // 如果在重试循环中没有成功，此行作为最终防线
                throw new Error("API 调用失败，未收到有效响应。");
            }
            // ******************************************************
            // <<-- 容错重试逻辑结束 -->>
            // ******************************************************

            const message = response.choices[0].message;
            messages.push(message);

            if (message.tool_calls && message.tool_calls.length > 0) {
                console.log(`\nAgent 请求调用 ${message.tool_calls.length} 个工具。`);

                const toolCalls = message.tool_calls;
                for (const toolCall of toolCalls) {
                    const functionName = toolCall.function.name;
                    const functionArgs = JSON.parse(toolCall.function.arguments);

                    console.log(`-> 调用工具: ${functionName}(${JSON.stringify(functionArgs)})`);

                    const functionToCall = toolFunctions[functionName];
                    const arg1 = functionArgs.filePath || functionArgs.command || functionArgs.dirPath;
                    const arg2 = functionArgs.content;

                    const toolOutput = await functionToCall(arg1, arg2);

                    console.log(`<- 工具执行完毕。`);

                    messages.push({
                        tool_call_id: toolCall.id,
                        role: "tool",
                        content: toolOutput,
                    });

                    finalResult.steps.push({
                        type: "tool_call",
                        call: `${functionName}(${JSON.stringify(functionArgs)})`,
                        output: toolOutput,
                    });
                }

                continue;
            }

            if (message.content) {
                console.log(`\nAgent 返回最终结果。`);
                finalResult.status = "success";
                finalResult.output = message.content;
                console.log(`最终输出:\n${message.content}`);
                break;
            }

            if (i === MAX_ITERATIONS - 1) {
                finalResult.status = "failure";
                finalResult.output = "达到最大迭代次数，Agent未能完成任务。";
                console.log(finalResult.output);
            }
        }
    } catch (error) {
        console.error("Agent 运行中发生致命错误:", error.message);
        finalResult.status = "error";
        finalResult.output = `致命错误: ${error.message}`;
    } finally {
        finalResult.executionTime = new Date().toISOString();
        await fs.writeFile(RESULT_ABSOLUTE_PATH, JSON.stringify(finalResult, null, 2), 'utf-8');
        console.log(`\n--- 流程结束 ---\n结果已保存到 ${RESULT_ABSOLUTE_PATH}`);
    }
}


// ----------------------------------------------------
// V. 运行 Agent (Main Function)
// ----------------------------------------------------

async function main() {
    console.log("DeepSeek Agent 启动...");

    // 基础配置检查
    if (!PROJECT_ROOT || !AGENT_WORK_SUBDIR || !TASK_FILE_NAME) {
        throw new Error("配置错误：请检查 .env 文件中的 PROJECT_ROOT, AGENT_WORK_SUBDIR 和 TASK_FILE_NAME 变量是否已设置。");
    }

    // 1. 确保项目根目录存在
    if (!existsSync(PROJECT_ROOT)) {
        throw new Error(`项目根目录不存在: ${PROJECT_ROOT}。请在 .env 文件中修改 PROJECT_ROOT 变量并创建该目录。`);
    }

    // 2. 确保工作目录存在
    if (!existsSync(AGENT_WORK_DIR)) {
        mkdirSync(AGENT_WORK_DIR, { recursive: true });
        console.log(`创建了 Agent 工作目录: ${AGENT_WORK_DIR}`);
    }

    // 3. 读取外部任务文件
    let userTaskContent = "";
    try {
        userTaskContent = await fs.readFile(TASK_FILE, 'utf-8');
        console.log(`成功读取任务文件: ${TASK_FILE}`);
    } catch (e) {
        throw new Error(`无法读取任务文件 ${TASK_FILE}。请确保文件存在且内容正确。错误: ${e.message}`);
    }

    await runDeepSeekAgent(userTaskContent);
}

main().catch(console.error);