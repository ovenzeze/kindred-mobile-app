<template>
  <div class="min-h-screen bg-default flex flex-col max-w-md mx-auto relative shadow-xl overflow-hidden">
    <AppHeader />

    <main class="flex-1 overflow-y-auto pb-20">
      <slot />
    </main>

    <AppNavbar />
  </div>
</template>

<style>
body {
  background-color: var(--ui-bg-muted);
  overscroll-behavior-y: contain;
}
</style>
