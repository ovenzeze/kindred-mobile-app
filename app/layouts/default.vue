<template>
  <div class="kindred-glass-strong relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden">
    <AppHeader />

    <main class="flex-1 overflow-y-auto pb-20">
      <slot />
    </main>

    <AppNavbar />
  </div>
</template>

<style>
body {
  overscroll-behavior-y: contain;
}
</style>
