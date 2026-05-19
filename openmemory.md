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

**决策：** 手写契约文件 `albums.ts`、`profile-fields.ts` 已存在；在 `npm run update-api` 生成的 `generated-api.ts` 尚未包含对应 endpoint 前，`app/shared-contracts/index.ts` 中 **不得** 注册 `albums` / `profileFields` router（否则运行时 500）。后端部署并同步 OpenAPI 后再取消注释。

**事实来源：** `app/shared-contracts/index.ts`、`app/shared-contracts/albums.ts`、`app/shared-contracts/profile-fields.ts`、`docs/rules/contracts.md`

---

## 待决事项

- 相册 UI 与 R2 预签名直传流程 — 未实现（契约已就绪）

---

### agent-browser 本地验收经验

**经验：** 在当前 Multica Linux 环境中，`agent-browser` 首次启动 Chrome 可能报 `No usable sandbox`；使用 `agent-browser --session kindred-qa --args "--no-sandbox" open http://localhost:5102` 可绕过。若 daemon 已启动且提示 `--args ignored`，先关闭 session 再重新打开。

**事实来源：** 2026-05-18 本地执行 `agent-browser doctor --offline --quick` 与 `agent-browser --session kindred-guide open http://localhost:5102`

**补充经验：** `snapshot -i` 不能验证视觉样式是否加载。2026-05-18 复查 `/auth/login` 时，页面可访问性树存在登录表单，但截图显示原始 HTML 样式；根因是 Nuxt UI v4 缺少全局 CSS 入口。修复为 `nuxt.config.ts` 配置 `css: ['~/assets/css/main.css']`，并在 `app/assets/css/main.css` 导入 `tailwindcss` 与 `@nuxt/ui`。后续验收登录/注册页必须同时保存截图并用 `eval` 检查关键元素 computed style。

**补充决策：** Nuxt UI v4 接入不只检查页面是否有样式。必须同时确认 `@nuxt/ui` module、CSS 入口、`UApp`、`app.config.ts` 主题、语义色 `color` prop、Lucide 图标、`UForm` 表单模式，以及 `.nuxt/ui/<component>.ts` slot 名称。项目规则见 `docs/rules/nuxt-ui.md`。

---

### Google 登录与主题现代化 (2026-05-18)

**决策：**
1. **Google 登录集成**：引入 `@nuxtjs/supabase` 模块，在 `auth` store 中新增 `loginWithGoogle`，并增加 `app/pages/auth/callback.vue` 处理 OAuth 回调。
2. **主题升级**：将主色调从 Rose 切换为 Indigo，中性色调整为 Slate。在 `main.css` 中引入 Inter 字体并统一 `--ui-radius` 为 `0.75rem`。
3. **Supabase 重定向修复**：`@nuxtjs/supabase` 默认将未登录用户重定向到 `/login`，已在 `nuxt.config.ts` 中配置 `redirectOptions` 统一到 `/auth/login`。
4. **契约容错**：由于后端 API 尚未部署 `albums` 和 `profileFields`，暂时在 `app/shared-contracts/index.ts` 中注释掉相关契约，以修复首页 500 错误。

**经验：**
- 使用 `agent-browser` 发现重定向循环或 404 时，检查是否是模块（如 Supabase）的默认行为与项目路径（如 `/auth/login` vs `/login`）不一致。
- 即使前一个 Agent 声称修复了样式或功能，务必使用 `agent-browser` 重新截图验证，事实胜于雄辩。
