# openmemory.md — Kindred Mobile Web App 项目记忆

> 记录已验证的经验、决策、坑点。已替代内容须显式标记。

---

## 已验证的决策

### API 基址通过 runtimeConfig

**决策：** `useApi()` 读取 `runtimeConfig.public.apiBaseUrl`；本地开发默认使用 `https://kapi.deth.dev/api/v1`，可通过 `.env` 的 `NUXT_PUBLIC_API_BASE_URL` 覆盖。

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

### ~~契约同步 v2（albums / profileFields 须保持注释）~~ → 已同步（2026-05-23）

**原记忆：** OpenAPI 未含 albums/profileFields 前，不得在 `index.ts` 注册对应 router。

**当前状态：** `npm run update-api` 已同步；`index.ts` 已注册 `albums`、`profileFields`；`generated-api.ts` 含对应 path。

**事实来源：** `app/shared-contracts/index.ts`、`curl` 验证 kapi 34 paths（见下节）

---

### shadcn-vue UI 栈（2026-05-19）

**决策：** UI 从 Nuxt UI 4 迁移至 `shadcn-vue` + `shadcn-nuxt`；组件源码在 `app/components/ui/`；全局样式入口为 `nuxt.config.ts` 的 `css: ['~/assets/css/main.css']`；`main.css` 首行 Google Fonts `@import`（Sora / Fraunces），并导入 `tailwindcss`、`tw-animate-css`、`shadcn-vue/tailwind.css`。

**事实来源：** `package.json`、`nuxt.config.ts`、`components.json`、`app/assets/css/main.css`、`docs/rules/shadcn-vue.md`

**已替代：** `docs/rules/nuxt-ui.md`、`@nuxt/ui` module、`app/app.config.ts` — 不再使用。

---

### Google 登录与 Supabase 重定向（2026-05-18）

**决策：**
1. **Google 登录：** `@nuxtjs/supabase` + `authStore.loginWithGoogle()` + `app/pages/auth/callback.vue`。
2. **Supabase 重定向：** `nuxt.config.ts` 中 `redirectOptions.login` 设为 `/auth/login`、`callback` 设为 `/auth/callback`，避免模块默认 `/login` 导致 404。
3. **契约：** `albums` / `profileFields` 已在 OpenAPI 同步后于 `index.ts` 注册（2026-05-23 起）。

**主题（已由 2026-05-19 shadcn-vue 迁移替代）：** 不再使用 Rose/Indigo/Inter/`--ui-radius` 的 Nuxt UI 主题方案；当前以 shadcn 语义 token 与 `app/assets/css/main.css` 为准。

**事实来源：** `app/stores/auth.ts`、`nuxt.config.ts`、`app/shared-contracts/index.ts`

---

### agent-browser 本地验收经验

**经验：** 在 Multica Linux 环境中，`agent-browser` 首次启动 Chrome 可能报 `No usable sandbox`；使用 `agent-browser --session kindred-qa --args "--no-sandbox" open http://localhost:5102` 可绕过。若 daemon 已启动且 `--args` 被忽略，先关闭 session 再重新打开。

**事实来源：** 2026-05-18 本地执行 `agent-browser doctor --offline --quick`

**补充经验：** `snapshot -i` 不能验证视觉样式是否加载。登录/注册页验收须同时截图并用 `eval` 检查关键元素 computed style（见 `docs/rules/agent-browser-qa.md`）。

**补充决策：** UI 接入须确认 `shadcn-nuxt` module、`components.json`、CSS 入口、`Toaster`、Lucide 图标、`FieldGroup` 表单模式，以及 `app/components/ui/<component>` 源码。规则见 `docs/rules/shadcn-vue.md`。

---

### kapi OpenAPI 与手写 albums/profileFields（2026-05-25 复核）

**现状：** `https://kapi.deth.dev/api/openapi.json` 仍为 **34** 条 path，含 albums/profileFields。`index.ts` 已注册 `albums` / `profileFields` router；`npm run sitemap` 已刷新 `public/sitemap.xml`（`lastmod` 2026-05-25）。

**验证：** `curl -s https://kapi.deth.dev/api/openapi.json | jq '.paths | keys | length'`（期望 34）。

---

## 2026-05-26 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/*.md` 引用路径均存在；`CLAUDE.md` 52 行，仍为纯导航。
- **OpenAPI：** kapi 仍为 34 paths；契约注册状态与 2026-05-25 一致。
- **Sitemap：** `npm run sitemap` 已刷新 `public/sitemap.xml`（7 URLs，`lastmod` 2026-05-26）。

---

## 待决事项

- 相册 UI 与 R2 预签名直传流程 — 未实现（契约已就绪）
