# shadcn-vue 规则

## 官方接入点

- 依赖：`shadcn-nuxt`、`shadcn-vue`、`reka-ui`、`lucide-vue-next`、`vue-sonner`、`tw-animate-css`、`class-variance-authority`、`clsx`、`tailwind-merge` 必须在 `package.json`。
- Tailwind v4 处理：`@tailwindcss/vite` 必须在 `devDependencies`，并在 `nuxt.config.ts` 的 `vite.plugins` 中注册 `tailwindcss()`；移除 `@nuxt/ui` 后不能依赖 Nuxt UI 间接处理 Tailwind。
- Nuxt 模块：`nuxt.config.ts` 必须注册 `modules: ['shadcn-nuxt']`，并配置 `shadcn.componentDir: './app/components/ui'`。
- CLI 配置：项目根目录必须有 `components.json`，CSS 入口为 `app/assets/css/main.css`，组件别名为 `@/components/ui`。
- 样式入口：`nuxt.config.ts` 必须包含 `css: ['~/assets/css/main.css']`。
- CSS 内容：`app/assets/css/main.css` 必须导入：

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn-vue/tailwind.css";
```

- 根组件：`app/app.vue` 直接渲染 `NuxtLayout` / `NuxtPage`，全局 toast 使用 `app/components/ui/sonner` 的 `Toaster`。

来源：shadcn-vue Nuxt 安装文档、项目 `components.json`、`npx shadcn-vue@latest info --json`。

---

## 组件使用

- UI 组件源码位于 `app/components/ui/`，通过 `npx shadcn-vue@latest add` 管理；本项目已安装官方 `--all` 组件。
- `app/layouts/default.vue` 只提供移动端外壳和底部导航，不渲染全局 `AppHeader`；需要顶部栏的页面自己放置一个 `AppHeader`，避免双层顶部导航。
- 按 skill 规则优先使用已有组件：按钮用 `Button`，错误提示用 `Alert`，头像用 `Avatar`，标签用 `Badge`，加载态用 `Skeleton` / `Spinner`。
- 表单使用 `FieldGroup` + `Field` + `FieldLabel` + 输入控件；校验状态用 `data-invalid` 与 `aria-invalid`。
- Overlay 使用 `Dialog` / `Sheet` / `Drawer` 时必须包含对应 Title，例如 `SheetTitle`。
- Toast 使用 `vue-sonner`，入口为 `Toaster`；页面内触发 toast 时从 `vue-sonner` 导入 `toast()`。
- 图标统一使用 `lucide-vue-next` 组件。按钮内图标使用 `data-icon="inline-start"` 或 `data-icon="inline-end"`。

---

## 样式约束

- 颜色优先使用 shadcn 语义 token：`bg-background`、`bg-card`、`bg-muted`、`text-foreground`、`text-muted-foreground`、`text-primary`、`border-border`。
- 不使用 Nuxt UI 的语义类：`text-highlighted`、`text-muted`、`text-dimmed`、`text-inverted`、`bg-default`、`bg-elevated`、`border-muted`。
- 布局间距使用 `flex` / `grid` + `gap-*`，不要新增 `space-x-*` / `space-y-*`。
- 等宽高元素使用 `size-*`。
- 不新增 `ui` prop、`app.config.ts` 的 Nuxt UI slot 覆盖，shadcn-vue 组件修改应直接改源码或用组件公开 variants。

---

## 周边生态

- 图片走 `@nuxt/image` / `NuxtImg`。
- 字体能力由 `@nuxt/fonts` 提供；当前全局 body 使用 `Sora`，标题使用 `Fraunces`，入口在 `app/assets/css/main.css` 的 `--font-sans` / `--font-heading`。
- PWA 由 `@vite-pwa/nuxt` 配置在 `nuxt.config.ts`。
- 状态管理走 `@pinia/nuxt`，不要绕过现有 stores。
