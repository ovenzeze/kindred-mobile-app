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

**决策：** UI 从 Nuxt UI 4 迁移至 `shadcn-vue` + `shadcn-nuxt`；组件源码在 `app/components/ui/`；全局样式入口为 `nuxt.config.ts` 的 `css: ['~/assets/css/main.css']`；`main.css` 首行 Google Fonts `@import`（Geist），并导入 `tailwindcss`、`tw-animate-css`、`shadcn-vue/tailwind.css`。

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

## 2026-06-03 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/*.md` 引用路径均存在；`CLAUDE.md` 已更新维护日期与文档体系表。
- **字体修正：** `openmemory.md` 中 shadcn-vue 决策条目的字体名从 "Sora / Fraunces" 修正为 "Geist"。
- **契约引用修正：** `docs/rules/contracts.md` 中对 `docs/rules/api.md` 的悬空引用已修正。
- **新代码未入文档：** `app/stores/user.ts`（用户资料缓存 store）、`app/middleware/dev-only.ts`（dev 模式守卫）、5 个新组件（`EmptyState`、`MatchOverlay`、`PhotoGrid`、`FieldGroupEditor`、`ProfileDetails`）、3 个新 util（`image.ts`、`profile-fields.ts`、`format.ts`）、PWA 配置、客户端图片压缩 — 均已实现但未在规则文件中记录。

---

## 2026-06-04 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/*.md` 引用路径均存在。
- **可信源更新：** `CLAUDE.md` 可信源补充 `app/stores/user.ts`、`app/middleware/dev-only.ts`、`app/utils/image.ts`、`app/utils/profile-fields.ts`、`app/utils/format.ts`；关键事实补充 PWA 与图片处理。
- **新组件入文档状态：**
  - `EmptyState` — 空状态占位组件
  - `MatchOverlay` — 匹配弹窗覆盖层
  - `PhotoGrid` — 照片网格（含压缩预览、多图上传）
  - `FieldGroupEditor` — 资料字段编辑器
  - `ProfileDetails` — 资料详情展示
- **新页面：** `app/pages/chat/[id].vue`（单聊页，含消息列表与输入）
- **布局重构：** commit `999bdad` 标准化移动端 layout shells，优化 viewport 滚动行为
- **PWA：** `nuxt.config.ts` 完整 PWA 配置（manifest、icons、apple-touch-icon、service worker）；`public/` 下新增 `pwa-192x192.png`、`pwa-512x512.png`、`apple-touch-icon.png`、`icon-transparent.png`
- **docs/rules/frontend.md 已更新：** 目录表包含 `app/utils/` 条目

---

## 2026-06-05 文档维护复核

- **规则更新：** `docs/rules/frontend.md` 已确认更新（目录表包含 `app/utils/` 条目）。
- **代码状态：** 无新代码变更；现有组件、store、middleware、utils 与 2026-06-04 记录一致。
- **Sitemap：** `public/sitemap.xml` 仍为 7 URLs，`lastmod` 2026-05-26；无新增页面需更新 sitemap。

---

## 2026-06-13 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **代码状态：** `preview` 分支自 2026-06-05 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。
- **维护说明：** 本轮按 `preview` 基线执行；历史 `docs/kindred-maintenance-*` 分支/PR 仍基于 `master`，未作为本轮基线。

---

## 2026-06-14 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **Sitemap：** `npm run sitemap` 已刷新 `public/sitemap.xml`（7 URLs，`lastmod=2026-06-14`）。
- **代码状态：** `preview` 分支自 2026-06-13 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-15 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **Sitemap：** `npm run sitemap` 已刷新 `public/sitemap.xml`（7 URLs，`lastmod=2026-06-15`）。
- **代码状态：** `preview` 分支自 2026-06-14 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-16 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **代码状态：** `preview` 分支自 2026-06-15 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-17 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **代码状态：** `preview` 分支自 2026-06-16 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-18 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **代码状态：** `preview` 分支自 2026-06-17 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-19 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **Sitemap：** `npm run sitemap` 已刷新 `public/sitemap.xml`（7 URLs，`lastmod=2026-06-19`）。
- **代码状态：** `preview` 分支自 2026-06-18 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-20 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **代码状态：** `preview` 分支自 2026-06-19 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-21 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **Sitemap：** `npm run sitemap` 已刷新 `public/sitemap.xml`（7 URLs，`lastmod=2026-06-21`）。
- **代码状态：** `preview` 分支自 2026-06-20 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-22 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **代码状态：** `preview` 分支自 2026-06-21 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-23 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **代码状态：** `preview` 分支自 2026-06-22 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-24 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **代码状态：** `preview` 分支自 2026-06-23 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-27 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **代码状态：** `preview` 分支自 2026-06-24 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-28 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **代码状态：** `preview` 分支自 2026-06-27 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-29 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **Sitemap：** `npm run sitemap` 已刷新 `public/sitemap.xml`（7 URLs，`lastmod=2026-06-29`）。
- **代码状态：** `preview` 分支自 2026-06-28 维护提交后无新增业务提交；现有组件、store、middleware、utils 与 2026-06-04/05 记录一致。

---

## 2026-06-30 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **代码状态：** `preview` 分支自 2026-06-29 维护提交后无新增业务提交；文档规则无需结构性修正。

---

## 2026-07-02 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **代码状态：** `preview` 分支自 2026-06-30 维护提交后无新增业务提交；文档规则无需结构性修正。

---

## 2026-07-17 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **Sitemap：** `npm run sitemap` 已刷新 `public/sitemap.xml`（7 URLs，`lastmod=2026-07-17`）。
- **代码状态：** `preview` 分支自 2026-06-30 维护提交后无新增业务提交；文档规则无需结构性修正。

---

## 2026-07-18 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **Sitemap：** `npm run sitemap` 已刷新 `public/sitemap.xml`（7 URLs，`lastmod=2026-07-18`）。
- **代码状态：** `preview` 分支自 2026-07-17 维护提交后无新增业务提交；文档规则无需结构性修正。

---

## 2026-07-19 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **Sitemap：** `npm run sitemap` 已刷新 `public/sitemap.xml`（7 URLs，`lastmod=2026-07-19`）。
- **代码状态：** `preview` 分支自 2026-07-18 维护提交后无新增业务提交；文档规则无需结构性修正。

---

## 2026-07-20 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **Sitemap：** `npm run sitemap` 已刷新 `public/sitemap.xml`（7 URLs，`lastmod=2026-07-20`）。
- **代码状态：** `preview` 分支自 2026-07-19 维护提交后无新增业务提交；文档规则无需结构性修正。

---

## 2026-07-21 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **Sitemap：** `npm run sitemap` 已刷新 `public/sitemap.xml`（7 URLs，`lastmod=2026-07-21`）。
- **代码状态：** `preview` 分支自 2026-07-20 维护提交后无新增业务提交；文档规则无需结构性修正。

---

## 2026-07-22 文档维护复核

- **规则与路径：** `CLAUDE.md`、`docs/rules/{frontend,contracts,shadcn-vue,agent-browser-qa}.md` 中引用的关键文件与命令均复核存在。
- **页面与 Sitemap：** `app/pages/` 当前包含首页、matches、profile、chat index/detail、auth login/register/callback、ui-kit；`scripts/generate-sitemap.ts` 仍覆盖 7 个公开入口，动态单聊页与 OAuth callback 不纳入 sitemap。
- **Sitemap：** `npm run sitemap` 已刷新 `public/sitemap.xml`（7 URLs，`lastmod=2026-07-22`）。
- **代码状态：** `preview` 分支自 2026-07-21 维护提交后无新增业务提交；文档规则无需结构性修正。

---

## 待决事项

- ~~相册 UI 与 R2 预签名直传流程~~ — 已实现（2026-05-28 起，含客户端图片压缩、多图上传、R2 预签名直传）
- ~~`app/stores/user.ts`、`app/middleware/dev-only.ts`、新组件与 utils 需补充文档~~ — 已在 2026-06-04 复核中记录于本文件；可信源已同步到 CLAUDE.md
- `docs/rules/frontend.md` 可考虑补充新组件使用模式（PhotoGrid 多图上传、FieldGroupEditor 表单模式）— 低优先级
