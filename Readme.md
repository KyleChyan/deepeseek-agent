<div align="center">
  <img src="https://github.com/deepseek-ai/DeepSeek-V2/blob/main/figures/logo.svg?raw=true" width="60%" alt="DeepSeek-V3" />
</div>

# DeepSeek Agent：智能代码修改与项目维护智能体

**DeepSeek Agent** 是一个基于 Node.js 和 DeepSeek API 构建的自主代码 Agent 框架。它能够理解复杂的自然语言任务指令，并利用文件读写、目录列表和 Shell 命令工具自主迭代，完成代码审查、Bug 修复、功能开发等任务。

这个 Agent 运行在一个安全的沙箱环境（`doc` 目录）内，确保项目代码的安全性。

## ✨ 特性概览

- 🤖**高效且兼容** 基于 DeepSeek API 的智能 Agent、兼容OpenAI
- 📁**读写支持**：提供 `read_file`, `write_file`, `list_directory`, `execute_shell_command` 四大工具。
- 🛠️**容错机制**：集成了 API 调用重试逻辑，增强在网络波动或 API 瞬时错误时的健壮性。
- 🔄**自动项目同步**：Agent 能够自动对项目同步，并进行多轮次的思考、工具调用和结果分析。
- 📊**RAG 优化**：提供脚本工具，预先同步代码并生成项目结构树，减少 Agent 探索成本。
- 🔒**沙箱安全**：所有文件操作、访问和 Shell 命令均限制在指定的 `doc` 工作目录内。

## ⚙️ 环境要求

在部署和运行 Agent 之前，请确保您的系统满足以下要求：

* **Node.js**: 版本 18.x 或更高。
* **DeepSeek API Key**: 拥有有效的 DeepSeek 账户和 API 密钥。
* **命令行工具**: `npm` 或 `yarn` 包管理器和基本的 shell 环境（用于执行 Agent 内的命令）。

## 🚀 项目部署

将项目克隆到本地，并安装必要的依赖。

```bash
# 克隆 Agent 项目（您正在使用的这个文件夹）
git clone <YOUR_AGENT_REPO_URL> deepeseek-agent
cd deepeseek-agent

# 安装 Node.js 依赖
npm install
```

### 📁 文件结构（Agent 目录）

```
deepeseek-agent/
├── agent_runner.js        # 🚀 Agent 核心执行逻辑
├── package.json           # 包含 npm 启动和工具脚本
├── .env.example           # 配置模板
├── sync_project.js        # 🔧 工具：项目代码同步脚本
├── generate_tree.js       # 🔧 工具：项目结构树生成脚本
└── tools-results/         # 结果输出目录 (如 project-tree.md)
```

## 🛠️ 使用前准备 (配置项目)

您需要配置 Agent 框架，使其能正确指向您的**实际项目代码**。

### 1\. 配置 `.env` 文件

复制 `.env.example` 并重命名为 `.env`，然后填写您的配置信息。

```bash
cp .env.example .env
```

| 变量 | 示例值 | 说明                                       |
| :--- | :--- |:-----------------------------------------|
| `DEEPSEEK_API_KEY` | `sk-xxxxxx` | 您的 DeepSeek API 密钥。                      |
| `PROJECT_ROOT` | `/path/to/my/actual/project` | **【重要】** 您的实际项目代码所在的绝对路径。                |
| `AGENT_WORK_SUBDIR` | `doc` | （建议默认）Agent 在 `PROJECT_ROOT` 下的沙箱工作目录名称。 |
| `TASK_FILE_NAME` | `AItasks.md` | （建议默认）包含任务指令的文件名称（位于 `PROJECT_ROOT`）。          |
| `RESULT_FILE_NAME` | `result.json` | （建议默认）Agent 最终输出结果的文件名（位于 `PROJECT_ROOT`）。     |
| `MAX_ITERATIONS` | `99` | （建议默认）Agent 最大的思考和工具调用轮次数。                     |

### 2\. 创建任务文件

在您的 **实际项目根目录** (`PROJECT_ROOT`) 下创建任务文件，例如 `AItasks.md`，并写入您的任务指令。

**示例 `PROJECT_ROOT/AItasks.md`：**

```markdown
# 任务目标

请完成以下代码修改：
1. 打开 `src/services/UserService.js` 文件。
2. 将其中的 `GET /api/users` 接口的返回字段 `status` 重命名为 `user_state`。
3. 确保其他文件中的调用也已同步修改。
4. 完成后，请总结你修改了哪些文件。
```

## 💻 操作步骤 (运行 Agent)

为了获得最佳效果，建议使用我们提供的组合脚本，它能自动完成同步、结构预加载和运行步骤。

### Step 1: 同步代码与生成结构树

在运行 Agent 之前，使用 `npm run run` 命令将您的代码同步到沙箱，并生成项目结构树。

```bash
# 切换到 Agent 目录
cd /path/to/deepeseek-agent

# 1. 自动将 PROJECT_ROOT 的代码复制到 PROJECT_ROOT/doc
# 2. 自动生成目录结构树并保存到 tools-results/project-tree.md
npm run sync 
npm run gen:tree
```

### Step 2: 优化 RAG（手动操作）

打开 `tools-results/project-tree.md`，将其内容复制到您的 `AItasks.md` 文件的顶部，作为 Agent 的初始化上下文。这将大大减少 Agent 探索项目结构所需的迭代次数。

### Step 3: 运行 Agent

现在执行 Agent 核心逻辑：

```bash
# 推荐使用组合命令：同步 -> 生成树 -> 运行 Agent
npm run run
# 或者只运行 Agent 核心逻辑
# node agent_runner.js
```

Agent 将开始在命令行输出其思考过程和工具调用结果。

### Step 4: 查看结果

Agent 运行结束后，会在 `PROJECT_ROOT` 目录下生成 `result.json` 文件，包含详细的执行步骤和最终总结。
**并且** Agent会修改、增加/doc文件夹下的内容，也就是AItasks.md对应的任务目标

```json
// PROJECT_ROOT/result.json
{
  "status": "success",
  "output": "我已完成了对 UserService.js 的修改，...",
  "steps": [
    // ... 详细的工具调用记录
  ],
  "executionTime": "2025-11-05T08:00:00.000Z"
}
```

-----

## ⚠️ 重要限制与安全提示

1.  **沙箱限制**：Agent 只能在 `PROJECT_ROOT/doc` 目录下进行文件读写和命令执行。它**无法**直接访问 `PROJECT_ROOT` 下的其他文件（如 `.git`, `.env`）。
2.  **编译/运行限制**：由于 Agent 运行环境可能缺少特定依赖（如 JavaFX），在实际项目中，Agent 可能会尝试执行失败的编译命令。建议在 **System Prompt** 中明确禁止 Agent 运行复杂的编译/测试命令，避免不必要的 API 消耗和卡死。
3.  **API 费用**：Agent 的每一次思考和工具调用都会消耗 DeepSeek API 费用。强烈建议使用 **RAG 优化 (Step 2)** 来减少迭代次数。

## 🤝 贡献与反馈

欢迎提交 Issue 或 Pull Request 来改进这个 Agent 框架！
