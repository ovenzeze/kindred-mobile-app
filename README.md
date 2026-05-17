# Kindred Mobile Web App

> **"Code is solidified thought."**
> Kindred Mobile Web App 是 Kindred 社交生态系统的移动端核心，基于 Nuxt 4 和 Vue 3 构建，致力于提供极致的移动优先（Mobile-First）体验。

## 🌌 项目愿景 (Project Vision)

Kindred 前端旨在打造一个纯粹、灵动且高度响应的社交平台。通过现代化的 Web 技术（PWA），我们打破了原生应用与网页之间的界限，让连接无处不在。

## 🛠 技术栈 (Tech Stack)

遵循 **顺势法则 (The Law of Flow)**，我们选择了当前最先进且稳定的技术生态：

*   **框架**: [Nuxt 4](https://nuxt.com/) (SSR: Disabled for SPA feel)
*   **UI 组件库**: [Nuxt UI](https://ui.nuxt.com/) (基于 Tailwind CSS & Reka UI)
*   **状态管理**: [Pinia](https://pinia.vuejs.org/)
*   **API 契约**: [@ts-rest/core](https://ts-rest.com/) (类型安全的 API 交互)
*   **移动端增强**: [Vite PWA](https://vite-pwa-org.netlify.app/frameworks/nuxt)
*   **性能优化**: @nuxt/image, @nuxt/fonts

## 📂 目录结构 (Directory Structure)

\`\`\`bash
Code/kindred-mobile-app/
├── app/                  # Nuxt 4 应用核心
│   ├── components/       # 原子级与业务组件
│   ├── composables/      # 逻辑复用 (如 useApi)
│   ├── layouts/          # 页面布局 (Default, Auth)
│   ├── pages/            # 路由页面 (Discover, Matches, Profile)
│   └── shared-contracts/ # 与后端同步的 API 契约
├── public/               # 静态资源与 PWA 图标
├── nuxt.config.ts        # 框架配置
└── package.json          # 依赖管理
\`\`\`

## 🚀 快速开始 (Getting Started)

### 安装依赖
\`\`\`bash
npm install
\`\`\`

### 启动开发服务器
\`\`\`bash
npm run dev
\`\`\`

### 构建生产版本
\`\`\`bash
npm run build
\`\`\`

## 🗺 初始组件规划 (Initial Component Roadmap)

为了实现核心业务流程，我们将优先开发以下组件：

### 1. 基础架构类 (Infrastructure)
*   **AppNavbar**: 移动端底部 Tab 导航（发现、匹配、消息、我）。
*   **AppHeader**: 包含页面标题、回退按钮或右侧操作项的顶部工具栏。
*   **PullToRefresh**: 下拉刷新容器，优化列表体验。

### 2. Core Business类 (Core Business)
*   **DiscoveryCard**: 发现页的核心组件，支持手势滑动动画的个人资料卡片。
*   **DiscoveryGallery**: 用户照片墙组件，支持点击放大。
*   **MatchCell**: 匹配列表中的单行项，展示头像、姓名和最后一条消息。
*   **ChatBubble**: 聊天对话气泡，区分发送者与接收者。

### 3. 反馈类 (Feedback)
*   **DiscoverySkeleton**: 发现页加载时的骨架屏。
*   **EmptyState**: 当没有匹配或消息时的空状态提示。

---

## 📜 秩序与准则 (Rules & Standards)

1.  **移动优先**: 所有组件必须在 375px - 430px 宽度下完美呈现。
2.  **类型安全**: 所有 API 调用必须基于 shared-contracts，禁止使用 any。
3.  **澄明法则**: 代码即文档，复杂的业务逻辑必须配有简洁的注释和对应的单元测试。
