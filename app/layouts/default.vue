<template>
  <div class="kindred-glass-strong relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden">
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
