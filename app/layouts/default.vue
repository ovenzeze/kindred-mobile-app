<template>
  <div class="fixed inset-0 mx-auto flex max-w-md flex-col overflow-hidden bg-background">
    <main class="relative flex-1 overflow-hidden">
      <slot />
    </main>

    <AppNavbar />
  </div>
</template>

<style>
body {
  /* Prevent system-level scrolling to keep the fixed shell stable */
  overflow: hidden;
  overscroll-behavior: none;
  background-color: var(--background);
}
</style>



