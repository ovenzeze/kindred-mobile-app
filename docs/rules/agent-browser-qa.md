# agent-browser 前端测试验收规则

## 适用范围

使用 `agent-browser` 对 Kindred Mobile Web App 做前端验收、冒烟测试、探索式 QA、回归验证和截图取证。

本地前端地址为 `http://localhost:5102`，后端 API 基址为 `http://localhost:3102/api/v1`。

## 启动前检查

1. 在 `kindred-api-server` 确认后端可访问：
   ```bash
   bun run dev
   ```
2. 在 `kindred-mobile-app` 确认前端可访问：
   ```bash
   npm run dev
   ```
3. 检查 `agent-browser` 环境：
   ```bash
   agent-browser doctor --offline --quick
   ```
4. 若 Chrome 报 `No usable sandbox`，首次打开页面时加：
   ```bash
   agent-browser --session kindred-qa --args "--no-sandbox" open http://localhost:5102
   ```

若已有 daemon 正在运行且 `--args` 被忽略，先关闭对应 session 后重新打开：

```bash
agent-browser --session kindred-qa close
agent-browser --session kindred-qa --args "--no-sandbox" open http://localhost:5102
```

## 基础验收循环

每次页面变化后重新 `snapshot`，不要复用旧的 `@eN` 引用：

```bash
agent-browser --session kindred-qa open http://localhost:5102
agent-browser --session kindred-qa wait --load networkidle
agent-browser --session kindred-qa snapshot -i
agent-browser --session kindred-qa screenshot --annotate dogfood-output/screenshots/initial.png
agent-browser --session kindred-qa console
agent-browser --session kindred-qa errors
```

`snapshot` 只能证明可访问性树中有表单和按钮，不能证明 CSS 已加载。登录页、注册页等视觉验收必须同时做截图和样式探针：

```bash
agent-browser --session kindred-qa screenshot dogfood-output/screenshots/login.png
cat <<'EOF' | agent-browser --session kindred-qa eval --stdin
(() => {
  const button = document.querySelector('button[type="submit"]')
  const heading = document.querySelector('h1')
  return {
    h1Count: document.querySelectorAll('h1').length,
    styleTagCount: document.querySelectorAll('style').length,
    headingFontSize: heading ? getComputedStyle(heading).fontSize : null,
    buttonBackground: button ? getComputedStyle(button).backgroundColor : null,
    buttonBorderRadius: button ? getComputedStyle(button).borderRadius : null
  }
})()
EOF
```

若截图像原始 HTML，或样式探针显示没有 style/link、按钮无背景色、标题字号未被 Tailwind 类影响，先检查 `nuxt.config.ts` 是否配置 `css: ['~/assets/css/main.css']`，以及 `app/assets/css/main.css` 是否包含：

```css
@import "tailwindcss";
@import "@nuxt/ui";
```

交互流程按以下顺序执行：

1. `snapshot -i` 找按钮、输入框、链接。
2. `click` / `fill` / `type` / `press` 执行动作。
3. 用 `wait --url`、`wait --text` 或 `wait --load networkidle` 等待稳定状态。
4. 再次 `snapshot -i` 验证页面结构。
5. 截图并检查 `console`、`errors`。

## 推荐覆盖路径

优先覆盖真实用户会走到的页面：

- `/auth/register`：注册表单、必填校验、提交失败提示、注册后跳转。
- `/auth/login`：登录表单、错误密码提示、登录后跳转。
- `/`：发现页加载、空态、喜欢/跳过按钮、API 失败态。
- `/matches`：匹配列表、空态、列表项点击。
- `/chat`：会话列表、空态、消息页入口。
- `/profile`：资料展示、编辑入口、登录保护。

已登录流程需要先通过 UI 登录一次，再保存状态：

```bash
agent-browser --session kindred-qa state save dogfood-output/auth-state.json
```

后续复测可复用：

```bash
agent-browser --session kindred-qa --state dogfood-output/auth-state.json open http://localhost:5102
```

## 缺陷取证标准

静态可见问题只需要一张带标注截图：

```bash
agent-browser --session kindred-qa screenshot --annotate dogfood-output/screenshots/issue-001.png
```

交互问题需要视频、步骤截图和最终状态截图：

```bash
agent-browser --session kindred-qa record start dogfood-output/videos/issue-001-repro.webm
agent-browser --session kindred-qa screenshot dogfood-output/screenshots/issue-001-step-1.png
agent-browser --session kindred-qa click @e1
agent-browser --session kindred-qa wait --load networkidle
agent-browser --session kindred-qa screenshot --annotate dogfood-output/screenshots/issue-001-result.png
agent-browser --session kindred-qa record stop
```

报告中必须包含：

- 现象
- 严重级别
- 复现步骤
- 期望结果
- 实际结果
- 截图或视频路径
- `console` / `errors` 中相关信息

## 判断准则

- 页面不能出现 Nuxt 500、空白屏、未处理异常或持续加载。
- 认证保护页未登录时应跳转到 `/auth/login`。
- 表单失败应给出用户可理解的错误，不应只在 console 报错。
- 移动端视口下按钮、导航、卡片和表单文字不能重叠或被裁切。
- API 失败、空列表、未登录状态都必须有明确 UI 状态。
- 每个发现的问题都要先复现一次，再开始正式取证。
