# CLAUDE.md — Kindred Mobile Web App

> **Maintained:** 2026-05-26
> **Project:** kindred-mobile-app — Nuxt 4 + Vue 3 + ts-rest 移动端 Web

---

## 文档体系

| 文件 | 角色 |
|------|------|
| `CLAUDE.md`（本文件） | 总入口：导航、可信源、查找顺序 |
| `openmemory.md` | 项目记忆：已验证经验、决策、坑点 |
| `workflow/maintenance.md` | 指导文档维护流程与自检清单 |
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
- `app/middleware/auth.ts`、`app/middleware/guest.ts` — 路由守卫
- `app/pages/auth/callback.vue` — Supabase OAuth 回调

---

## 当前关键事实

- **开发端口：** `5102`（`nuxt.config.ts` + `package.json` scripts）
- **API 基址：** `NUXT_PUBLIC_API_BASE_URL`，本地默认 `https://kapi.deth.dev/api/v1`
- **渲染：** `ssr: false`（SPA 体验）
- **契约同步：** `npm run update-api` → `scripts/update-api.sh`
