<template>
  <div class="min-h-screen bg-white flex flex-col">
    <div class="flex-1 flex flex-col justify-center px-6 py-12">
      <div class="mx-auto w-full max-w-sm">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Kindred</h1>
          <p class="mt-2 text-sm text-gray-600">
            <slot name="subtitle" />
          </p>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
