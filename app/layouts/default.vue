<template>
  <div class="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative shadow-xl overflow-hidden">
    <!-- Header Component -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto pb-20">
      <slot />
    </main>

    <!-- Bottom Navigation Component -->
    <AppNavbar />
  </div>
</template>

<style>
/* Global mobile app look */
body {
  background-color: #f3f4f6;
  overscroll-behavior-y: contain;
}
</style>
