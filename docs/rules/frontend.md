# 前端开发规则

## 目录约定（Nuxt 4）

应用代码位于 `app/`：

| 路径 | 用途 |
|------|------|
| `app/pages/` | 路由页面 |
| `app/components/` | 组件 |
| `app/composables/` | 组合式函数（如 `useApi`） |
| `app/stores/` | Pinia stores |
| `app/middleware/` | 路由中间件 |
| `app/layouts/` | 布局（`default`、`auth`） |
| `app/shared-contracts/` | API 契约 |

来源：`app/` 目录结构、`nuxt.config.ts` 中 `future.compatibilityVersion: 4`

---

## API 调用

- 一律通过 `useApi()` 返回的 ts-rest `client`
- 禁止手写 `fetch` 拼 URL（除 `update-api.sh` 拉 OpenAPI 外）
- 类型以 `shared-contracts` 为准

---

## 认证页面

- 登录：`app/pages/auth/login.vue`，布局 `auth`（含 Google OAuth 按钮，调用 `authStore.loginWithGoogle()`）
- 注册：`app/pages/auth/register.vue`
- OAuth 回调：`app/pages/auth/callback.vue`（`@nuxtjs/supabase` 完成会话后写 Pinia / localStorage）
- 需登录的业务页在 `definePageMeta` 中声明 `middleware: 'auth'`

`nuxt.config.ts` 中 `supabase.redirectOptions` 须将 `login` 设为 `/auth/login`、`callback` 设为 `/auth/callback`，避免模块默认 `/login` 导致 404。

来源：`nuxt.config.ts`、`app/stores/auth.ts`

---

## 环境变量

复制 `.env.example` 为 `.env`，设置：

```
NUXT_PUBLIC_API_BASE_URL=https://kapi.deth.dev/api/v1
```

本地前端默认连接 `kapi.deth.dev`，不再假设后端跑在 `localhost:3102`。
