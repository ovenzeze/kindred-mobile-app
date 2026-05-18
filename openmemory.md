# openmemory.md — Kindred Mobile Web App 项目记忆

> 记录已验证的经验、决策、坑点。已替代内容须显式标记。

---

## 已验证的决策

### API 基址通过 runtimeConfig

**决策：** `useApi()` 读取 `runtimeConfig.public.apiBaseUrl`；本地开发在 `.env` 设置 `NUXT_PUBLIC_API_BASE_URL`，勿依赖 `nuxt.config.ts` 中过时的默认值。

**事实来源：** `nuxt.config.ts`、`app/composables/useApi.ts`、`.env.example`

---

### 契约与后端 OpenAPI 同步

**决策：** `app/shared-contracts/` 通过 `scripts/update-api.sh` 从部署的 OpenAPI（`https://kapi.deth.dev/api/openapi.json`）生成 `openapi-types.ts` 与 `generated-api.ts`；手写契约文件（`auth.ts` 等）仍为 ts-rest 运行时来源，新增域时需同时更新手写契约与 `index.ts`。

**事实来源：** `scripts/update-api.sh`、`app/shared-contracts/index.ts`

---

### 认证与会话

**决策：** Pinia `useAuthStore` 管理 session；`localStorage` 键 `kindred_session` / `kindred_user`；`useApi` 对非 `/auth/` 路径附加 `Authorization`，401 时尝试 `refreshSession` 一次。

**事实来源：** `app/stores/auth.ts`、`app/composables/useApi.ts`

---

### 路由守卫

**决策：** `middleware/auth.ts` 保护需登录页；`middleware/guest.ts` 用于登录/注册页；客户端首次进入时 `authStore.initialize()` 从 localStorage 恢复会话。

**事实来源：** `app/middleware/auth.ts`、`app/middleware/guest.ts`

---

### 契约同步 v2（albums / profileFields）

**决策：** 已补全 `albums` 和 `profileFields` 域的手写契约，并与后端 v2 协议完全同步。

**事实来源：** `app/shared-contracts/index.ts`、`app/shared-contracts/albums.ts`、`app/shared-contracts/profile-fields.ts`

---

## 待决事项

- 相册 UI 与 R2 预签名直传流程 — 未实现（契约已就绪）

---

### agent-browser 本地验收经验

**经验：** 在当前 Multica Linux 环境中，`agent-browser` 首次启动 Chrome 可能报 `No usable sandbox`；使用 `agent-browser --session kindred-qa --args "--no-sandbox" open http://localhost:5102` 可绕过。若 daemon 已启动且提示 `--args ignored`，先关闭 session 再重新打开。

**事实来源：** 2026-05-18 本地执行 `agent-browser doctor --offline --quick` 与 `agent-browser --session kindred-guide open http://localhost:5102`

**补充经验：** `snapshot -i` 不能验证视觉样式是否加载。2026-05-18 复查 `/auth/login` 时，页面可访问性树存在登录表单，但截图显示原始 HTML 样式；根因是 Nuxt UI v4 缺少全局 CSS 入口。修复为 `nuxt.config.ts` 配置 `css: ['~/assets/css/main.css']`，并在 `app/assets/css/main.css` 导入 `tailwindcss` 与 `@nuxt/ui`。后续验收登录/注册页必须同时保存截图并用 `eval` 检查关键元素 computed style。

**补充决策：** Nuxt UI v4 接入不只检查页面是否有样式。必须同时确认 `@nuxt/ui` module、CSS 入口、`UApp`、`app.config.ts` 主题、语义色 `color` prop、Lucide 图标、`UForm` 表单模式，以及 `.nuxt/ui/<component>.ts` slot 名称。项目规则见 `docs/rules/nuxt-ui.md`。
