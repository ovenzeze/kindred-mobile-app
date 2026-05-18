# Nuxt UI 规则

## 官方接入点

- 依赖：`@nuxt/ui` 与 `tailwindcss` 必须在 `package.json`。
- Nuxt 模块：`nuxt.config.ts` 必须注册 `modules: ['@nuxt/ui']`。
- 样式入口：`nuxt.config.ts` 必须包含 `css: ['~/assets/css/main.css']`。
- CSS 内容：`app/assets/css/main.css` 必须导入：

```css
@import "tailwindcss";
@import "@nuxt/ui";
```

- 根组件：`app/app.vue` 必须用 `UApp` 包裹 `NuxtLayout` / `NuxtPage`，否则 Toast、Tooltip、Overlay 等全局能力不完整。

来源：Nuxt UI v4 官方安装文档与 Components 文档。

---

## 主题配置

- 运行时主题入口是 `app/app.config.ts` 的 `ui.colors`。
- 本项目使用 Nuxt UI v4 语义色：`primary`、`secondary`、`success`、`info`、`warning`、`error`、`neutral`。
- 组件 `color` prop 禁止继续使用旧写法：`red`、`blue`、`green`、`gray`、`white`。
- 应改为语义色：错误用 `error`，确认/喜欢用 `success`，信息/强调用 `info`，普通按钮用 `neutral`。
- 图标统一使用 `i-lucide-*`，默认图标在 `app.config.ts` 的 `ui.icons` 配置。

---

## 组件使用

- Layout：应用根用 `UApp`；页面骨架继续由 Nuxt `layouts` 承担。
- Form：登录/注册等交互表单使用 `UForm` + `UFormField` + `UInput` / `UTextarea`，验证错误交给 `UFormField` 按 `name` 显示。
- Element：按钮使用 `UButton`，错误提示使用 `UAlert`，头像使用 `UAvatar`，标签使用 `UBadge`，加载态使用 `USkeleton`，图标使用 `UIcon`。
- Overlay：侧边编辑面板使用 `USlideover`；新增 Modal/Popover/Tooltip 前必须确认根部已有 `UApp`。
- Navigation：底部导航目前保留 `NuxtLink`，但颜色必须使用 semantic utilities，例如 `text-muted`、`text-primary`。
- Data/Empty：列表空态可继续用 `UIcon` + 文案；复杂列表、分页、筛选再升级到 `UTable`、`UTabs`、`UPagination` 等组件。

---

## 样式约束

- 文本、边框、背景优先使用 Nuxt UI semantic utilities：`text-highlighted`、`text-muted`、`text-dimmed`、`text-inverted`、`bg-default`、`bg-elevated`、`border-muted`。
- 不在组件 `color` prop 中传 Tailwind 调色板颜色。
- 使用 `ui` prop 覆盖 Nuxt UI slot 时，先看 `.nuxt/ui/<component>.ts` 的 slot 名称；例如 `UCard` v4 的 body slot 是字符串 `body`，不是旧式 `{ body: { base, padding } }`。
- `snapshot` 只能证明结构存在，不能证明 Nuxt UI 样式加载。视觉验收必须保存截图并检查 computed style。

---

## 周边生态

- 图片走 `@nuxt/image` / `NuxtImg`。
- 字体能力由 `@nuxt/fonts` 提供，主题字体需要在 CSS/theme 中集中处理。
- PWA 由 `@vite-pwa/nuxt` 配置在 `nuxt.config.ts`。
- 状态管理走 `@pinia/nuxt`，不要绕过现有 stores。
