// sync_project.js

import * as fs from 'fs/promises';
import { existsSync, statSync } from 'fs';
import * as path from 'path';
import 'dotenv/config';

const PROJECT_ROOT = process.env.PROJECT_ROOT;
const AGENT_WORK_SUBDIR = process.env.AGENT_WORK_SUBDIR;
const AGENT_WORK_DIR = path.join(PROJECT_ROOT, AGENT_WORK_SUBDIR);

if (!PROJECT_ROOT || !AGENT_WORK_SUBDIR) {
    console.error("错误: 请检查 .env 文件中的 PROJECT_ROOT 和 AGENT_WORK_SUBDIR 配置。");
    process.exit(1);
}

/**
 * 递归删除文件夹内容
 * @param {string} dirPath
 */
async function clearDir(dirPath) {
    if (existsSync(dirPath)) {
        console.log(`正在清空目标目录: ${dirPath}`);
        for (const file of await fs.readdir(dirPath)) {
            const curPath = path.join(dirPath, file);
            if (statSync(curPath).isDirectory()) {
                // 跳过敏感目录，例如 .git
                if (file === '.git' || file === 'node_modules') continue;
                await fs.rm(curPath, { recursive: true, force: true });
            } else {
                await fs.unlink(curPath);
            }
        }
    } else {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

/**
 * 递归复制文件和文件夹（排除 doc 目录本身）
 * @param {string} src 源路径
 * @param {string} dest 目标路径
 */
async function copyRecursive(src, dest) {
    const stats = await fs.stat(src);
    const isDirectory = stats.isDirectory();

    if (isDirectory) {
        // 排除目标目录本身，避免无限复制循环
        if (src === AGENT_WORK_DIR) return;

        await fs.mkdir(dest, { recursive: true });
        for (const file of await fs.readdir(src)) {
            const curSrc = path.join(src, file);
            // 排除隐藏文件、node_modules 等
            if (file.startsWith('.') || file === 'node_modules') continue;
            const curDest = path.join(dest, file);
            await copyRecursive(curSrc, curDest);
        }
    } else {
        await fs.copyFile(src, dest);
        process.stdout.write('.');
    }
}

async function runSync() {
    try {
        console.log(`\n--- 1. 清空 Agent 工作目录 ---`);
        await clearDir(AGENT_WORK_DIR);

        console.log(`\n--- 2. 开始从 ${PROJECT_ROOT} 同步文件到 ${AGENT_WORK_DIR} ---`);
        await copyRecursive(PROJECT_ROOT, AGENT_WORK_DIR);

        console.log(`\n--- 同步完成！ ---`);
    } catch (error) {
        console.error("同步过程中发生错误:", error);
        process.exit(1);
    }
}

runSync();