# shared-contracts 同步规则

## 更新流程

1. 确保后端已部署最新 OpenAPI（或本地运行后临时改 `scripts/update-api.sh` 中的 URL）
2. 运行 `npm run update-api`
3. 检查 `app/shared-contracts/generated-api.ts` 与 `openapi-types.ts` diff
4. 按需更新手写契约（`auth.ts`、`profile.ts` 等）与 `app/shared-contracts/index.ts` 的 `appContract` router
5. 运行 `nuxt prepare` 或 `npm run dev` 验证类型

来源：`scripts/update-api.sh`、`package.json` scripts

---

## 职责划分

| 文件 | 角色 |
|------|------|
| `generated-api.ts` | OpenAPI 生成的 Zod / endpoints（勿手改） |
| `openapi-types.ts` | OpenAPI 生成的 TS 类型（勿手改） |
| `schemas.ts`、`mapper.ts` | 手写共享 schema 与映射 |
| `*.ts`（各域） | ts-rest 契约，运行时唯一路由定义 |
| `index.ts` | `appContract` 聚合 |

---

## 与后端对齐

后端仓库：`kindred-api-server`。契约优先原则与 `docs/rules/api.md` 一致；前端变更应跟随后端 `src/contracts/` 或已部署的 `/api/openapi.json`。

若 `appContract` 注册了 `generated-api.ts` 中尚不存在的 router，ts-rest 客户端会在运行时抛 `Endpoint X not found`。临时修复：在 `app/shared-contracts/index.ts` 注释对应导出；长期修复：部署后端并执行 `npm run update-api` 后再注册。

**当前（2026-05-23）：** `kapi.deth.dev`（本地 3102）OpenAPI 已含 **34** 条 path，含 `albums` / `profileFields`。执行 `npm run update-api` 后可在 `index.ts` 注册对应 router。验证：`curl -s https://kapi.deth.dev/api/openapi.json | jq '.paths | keys | length'`（期望 34）。

来源：`openmemory.md`、`docs/rules/agent-browser-qa.md`
