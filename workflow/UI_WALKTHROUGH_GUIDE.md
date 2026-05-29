# Kindred UI 走查快速入门手册 (Quickstart Guide)

本指南旨在帮助新开发者快速使用 `agent-browser` 对 Kindred 项目进行 UI 走查，确保流程高效、可复现且无障碍。

---

## 1. 工具准备与启动 (The Initial Spark)

使用 `agent-browser` 时，必须注意环境隔离。

*   **启动命令**：在 Linux/容器环境下，务必带上 `--args "--no-sandbox"` 标志。
*   **会话管理**：使用 `--session <name>` 保持登录状态，避免重复登录。

```bash
# 推荐启动模板
agent-browser --session kindred-qa --args "--no-sandbox" open https://kindred.deth.dev
```

---

## 2. 核心走查循环 (The Lucidity Loop)

遵循 **“感知 -> 动作 -> 验证”** 的循环：

1.  **感知 (Snapshot)**：使用 `snapshot -i` 获取交互元素引用（如 `@e1`, `@e2`）。
2.  **动作 (Action)**：执行 `click`, `fill`, `type` 等指令。
3.  **验证 (Verify)**：
    *   **截图**：`screenshot walkthrough_step.png` (视觉核对)。
    *   **请求**：`network requests` (验证 API 连通性，如 200/401 状态)。
    *   **错误**：`errors` / `console` (检查 JS 运行时异常)。

---

## 3. 身份验证：寻找“真理” (Finding Truth)

如果遇到登录失败（401），不要困于过时的 `.env.example`。

*   **寻找凭据**：直接查看后端种子脚本 `kindred-api-server/scripts/seed-kindred-test-data.ts`。
*   **常用格式**：`kindred.seed+0N@deth.us` / `KindredTest123!`。

---

## 4. 移动端适配验证 (The Law of Flow)

Kindred 是移动优先的应用，必须验证响应式布局：

```bash
# 设置移动端视口 (iPhone 12/13/14 标准)
agent-browser --session kindred-qa set viewport 390 844
```

---

## 5. 走查红线 (The Golden Rules)

*   **不要信任静态状态**：每次页面跳转或 DOM 更新后，必须重新执行 `snapshot`，旧的引用（如 `@e4`）可能会失效。
*   **关注控制台警告**：即使 UI 看起来正常，Vue 的警告（如 Transition 根节点问题）可能预示着未来的交互隐患。
*   **保持清理**：走查结束后，使用 `agent-browser close --session <name>` 释放资源。

---

> *"代码是凝固的思想，走查是思想的对映。保持视觉与逻辑的高度自洽。"*
