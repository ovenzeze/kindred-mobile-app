# CLAUDE.md — Kindred Mobile Web App

> **Maintained:** 2026-06-18
> **Project:** kindred-mobile-app — Nuxt 4 + Vue 3 + ts-rest 移动端 Web

---

## 文档体系

| 文件 | 角色 |
|------|------|
| `CLAUDE.md`（本文件） | 总入口：导航、可信源、查找顺序 |
| `openmemory.md` | 项目记忆：已验证经验、决策、坑点 |
| `workflow/maintenance.md` | 指导文档维护流程与自检清单 |
| `workflow/UI_WALKTHROUGH_GUIDE.md` | UI 走查指南（agent-browser 验收流程） |
| `docs/rules/*.md` | 当前规则（每文件一主题） |

**当前规则文件：**
- `docs/rules/frontend.md` — Nuxt 结构、路由守卫、API 客户端
- `docs/rules/shadcn-vue.md` — shadcn-vue 安装、主题、组件和验收规则
- `docs/rules/contracts.md` — 与后端 OpenAPI 同步 shared-contracts
- `docs/rules/agent-browser-qa.md` — 使用 agent-browser 做前端测试验收

---

## 文档查找顺序

1. **文档维护流程** → `workflow/maintenance.md`
2. **快速上手** → `README.md`
3. **编码规则** → `docs/rules/*.md`
4. **项目记忆** → `openmemory.md`

---

## 可信源

- `package.json` — 脚本、依赖、dev 端口（`nuxt dev --port 5102`）
- `nuxt.config.ts` — `runtimeConfig.public.apiBaseUrl`、`@nuxtjs/supabase` 的 `redirectOptions`、全局 CSS 入口
- `.env.example` — `NUXT_PUBLIC_API_BASE_URL`
- `app/shared-contracts/` — ts-rest 契约与类型（与后端 API 对齐；`albums` / `profileFields` 已在 `index.ts` 注册，见 `docs/rules/contracts.md`）
- `app/composables/useApi.ts` — ts-rest 客户端、JWT 注入、401 刷新
- `app/stores/auth.ts` — 会话持久化、邮箱登录/注册/刷新、`loginWithGoogle`
- `app/stores/user.ts` — 用户资料缓存 store
- `app/middleware/auth.ts`、`app/middleware/guest.ts`、`app/middleware/dev-only.ts` — 路由守卫
- `app/utils/image.ts` — 客户端图片压缩（多图并行处理）
- `app/utils/profile-fields.ts` — 资料字段定义与工具
- `app/utils/format.ts` — 格式化工具
- `app/pages/auth/callback.vue` — Supabase OAuth 回调

---

## 当前关键事实

- **开发端口：** `5102`（`nuxt.config.ts` + `package.json` scripts）
- **API 基址：** `NUXT_PUBLIC_API_BASE_URL`，本地默认 `https://kapi.deth.dev/api/v1`
- **渲染：** `ssr: false`（SPA 体验）
- **契约同步：** `npm run update-api` → `scripts/update-api.sh`
- **PWA：** `@vite-pwa/nuxt`，manifest + apple-touch-icon + service worker
- **图片处理：** 客户端压缩（`app/utils/image.ts`），多图并行上传，R2 预签名直传
