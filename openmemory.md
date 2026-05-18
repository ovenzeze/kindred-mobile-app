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

## 待决事项

- `shared-contracts` 尚未包含后端的 `albums` / `profileFields` 域 — 待后端稳定后运行 `update-api` 并补全手写契约
- 相册 UI 与 R2 直传流程 — 未实现
