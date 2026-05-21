<template>
  <div class="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden shadow-2xl shadow-rose-950/10">
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
