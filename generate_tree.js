// generate_tree.js

import * as fs from 'fs/promises';
import { existsSync, statSync } from 'fs';
import * as path from 'path';
import 'dotenv/config';

const AGENT_WORK_SUBDIR = process.env.AGENT_WORK_SUBDIR;
const PROJECT_ROOT = process.env.PROJECT_ROOT;

if (!PROJECT_ROOT || !AGENT_WORK_SUBDIR) {
    console.error("错误: 请检查 .env 文件中的 PROJECT_ROOT 和 AGENT_WORK_SUBDIR 配置。");
    process.exit(1);
}

const AGENT_WORK_DIR = path.join(PROJECT_ROOT, AGENT_WORK_SUBDIR);
const TOOLS_RESULTS_DIR = path.join(path.dirname(process.argv[1]), 'tools-results');
const OUTPUT_FILE = path.join(TOOLS_RESULTS_DIR, 'project-tree.md');

/**
 * 递归生成目录树结构字符串
 * @param {string} dirPath
 * @param {string} prefix
 * @param {string} baseDir
 * @returns {Promise<string>}
 */
async function generateTree(dirPath, prefix = '', baseDir = dirPath) {
    const isRoot = dirPath === baseDir;
    let output = '';

    if (isRoot) {
        output += `${path.basename(baseDir)}\n`;
    }

    try {
        const files = await fs.readdir(dirPath);
        const filteredFiles = files.filter(f => !f.startsWith('.') && f !== 'node_modules'); // 排除隐藏和依赖目录

        for (let i = 0; i < filteredFiles.length; i++) {
            const file = filteredFiles[i];
            const filePath = path.join(dirPath, file);
            const isLast = i === filteredFiles.length - 1;
            const newPrefix = prefix + (isLast ? '    ' : '│   ');

            output += prefix + (isLast ? '└── ' : '├── ') + file + '\n';

            if (statSync(filePath).isDirectory()) {
                output += await generateTree(filePath, newPrefix, baseDir);
            }
        }
    } catch (e) {
        // 如果遇到权限问题或文件不存在，则跳过
        console.warn(`无法读取目录 ${dirPath}: ${e.message}`);
    }
    return output;
}

async function runTreeGen() {
    try {
        // 确保结果目录存在
        if (!existsSync(TOOLS_RESULTS_DIR)) {
            await fs.mkdir(TOOLS_RESULTS_DIR, { recursive: true });
        }

        console.log(`\n--- 1. 正在从 Agent 工作目录生成项目结构树 ---`);
        const treeContent = await generateTree(AGENT_WORK_DIR);

        const finalContent = `
# 项目目录结构 (${AGENT_WORK_SUBDIR} 文件夹)
*此文件由 'npm run gen:tree' 自动生成，用于为 Agent 提供上下文。*

\`\`\`
${path.basename(AGENT_WORK_DIR)}
${treeContent}
\`\`\`
        `.trim();

        await fs.writeFile(OUTPUT_FILE, finalContent, 'utf-8');
        console.log(`\n--- 2. 项目结构树已保存到 ${OUTPUT_FILE} ---`);

    } catch (error) {
        console.error("生成结构树过程中发生错误:", error);
        process.exit(1);
    }
}

runTreeGen();