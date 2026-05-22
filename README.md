# Kindred Mobile Web App

> Kindred 社交生态的移动端 Web 核心：Nuxt 4 + Vue 3 + ts-rest，移动优先 PWA。

## 技术栈

- **框架:** Nuxt 4（`ssr: false`，SPA 体验）
- **UI:** shadcn-vue + shadcn-nuxt
- **状态:** Pinia
- **API:** @ts-rest/core + `app/shared-contracts`
- **PWA:** @vite-pwa/nuxt

## 快速开始

```bash
cp .env.example .env
npm install
npm run dev
```

开发地址：`http://localhost:5102`

## 环境变量

| 变量 | 说明 |
|------|------|
| `NUXT_PUBLIC_API_BASE_URL` | 后端 API 基址，默认 `https://kapi.deth.dev/api/v1` |

## 常用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器（端口 5102） |
| `npm run build` | 生产构建 |
| `npm run update-api` | 从部署 OpenAPI 同步 `shared-contracts` |

## 目录结构

```
kindred-mobile-app/
├── app/
│   ├── components/       # UI 组件
│   ├── composables/      # useApi 等
│   ├── layouts/          # default, auth
│   ├── middleware/       # auth, guest
│   ├── pages/            # 路由（含 auth/）
│   ├── stores/           # auth, user
│   ├── utils/
│   └── shared-contracts/ # API 契约
├── scripts/update-api.sh
├── workflow/maintenance.md
├── docs/rules/           # frontend, contracts, shadcn-vue, agent-browser-qa
├── CLAUDE.md
├── openmemory.md
├── nuxt.config.ts
└── package.json
```

## 文档体系

维护与阅读顺序见 `CLAUDE.md`；文档自检流程见 `workflow/maintenance.md`。

## 项目进展

- **2026-05-17:** 发现页、匹配、聊天、资料等初版 UI；契约与后端对齐。
- **2026-05-18:** 建立三层文档体系（CLAUDE / openmemory / docs/rules）；补充 UI 接入规则与 agent-browser 验收规则；修复全局 CSS 入口；契约同步 albums/profileFields v2。
- **2026-05-19:** UI 框架从 Nuxt UI 4 切换为 shadcn-vue + shadcn-nuxt，并安装官方全量组件到 `app/components/ui/`。
- **2026-05-21:** 文档维护：默认 API 基址对齐 `kapi.deth.dev`；agent-browser 验收改 curl health；字体加载与 shadcn 规则同步。
- **2026-05-22:** 文档维护：复核 kapi OpenAPI 仍缺 albums/profileFields；`index.ts` 注释策略不变。
