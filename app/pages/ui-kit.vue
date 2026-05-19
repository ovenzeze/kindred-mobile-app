<template>
  <div class="flex h-full flex-col">
    <AppHeader>
      <template #left>
        <div>
          <p class="text-xs font-semibold uppercase text-primary">Local only</p>
          <h1 class="text-xl font-bold text-highlighted">Kindred UI Kit</h1>
        </div>
      </template>
      <template #right>
        <UBadge color="primary" variant="soft" icon="i-lucide-flask-conical">Dev</UBadge>
      </template>
    </AppHeader>

    <div class="flex-1 space-y-5 overflow-y-auto p-4">
      <UCard class="kindred-sheen" :ui="{ body: 'space-y-4 p-5 sm:p-5' }">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-muted">Design direction</p>
            <h2 class="mt-1 text-2xl font-bold text-highlighted">Glass-first, warm, and tactile</h2>
          </div>
          <UIcon name="i-lucide-sparkles" class="size-7 text-primary" />
        </div>
        <p class="text-sm leading-6 text-muted">
          Nuxt UI stays as the accessible component base. Kindred customizes semantic color aliases,
          component slots, and a small set of glass utilities so product screens can stay consistent
          without hand-styling each control.
        </p>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="tone in tones"
            :key="tone.label"
            class="rounded-2xl p-3 text-center ring-1 ring-white/40 backdrop-blur-xl"
            :class="tone.class"
          >
            <p class="text-xs font-semibold">{{ tone.label }}</p>
          </div>
        </div>
      </UCard>

      <UCard :ui="{ header: 'space-y-1 p-5 sm:px-5', body: 'space-y-4 p-5 sm:p-5' }">
        <template #header>
          <h2 class="text-lg font-semibold text-highlighted">Actions</h2>
          <p class="text-sm text-muted">Primary commands use solid warmth; secondary controls stay translucent.</p>
        </template>
        <div class="flex flex-wrap gap-2">
          <UButton icon="i-lucide-heart" size="lg">Like</UButton>
          <UButton icon="i-lucide-message-circle" color="secondary" variant="solid" size="lg">Message</UButton>
          <UButton icon="i-lucide-star" color="warning" variant="soft" size="lg">Super</UButton>
          <UButton icon="i-lucide-x" color="neutral" variant="outline" size="lg" aria-label="Dismiss" />
        </div>
        <div class="flex items-center gap-3">
          <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" aria-label="Previous" />
          <UButton icon="i-lucide-bell" color="neutral" variant="soft" aria-label="Notifications" />
          <UButton icon="i-lucide-settings-2" color="neutral" variant="subtle" aria-label="Settings" />
        </div>
      </UCard>

      <UCard :ui="{ header: 'space-y-1 p-5 sm:px-5', body: 'space-y-4 p-5 sm:p-5' }">
        <template #header>
          <h2 class="text-lg font-semibold text-highlighted">Forms</h2>
          <p class="text-sm text-muted">Inputs keep the glass language but retain strong focus states.</p>
        </template>
        <UFormField label="Display name">
          <UInput v-model="profile.displayName" icon="i-lucide-user" class="w-full" />
        </UFormField>
        <UFormField label="Bio">
          <UTextarea v-model="profile.bio" :rows="3" class="w-full" />
        </UFormField>
        <div class="flex items-center justify-between rounded-3xl bg-default/35 p-3 ring-1 ring-white/40 backdrop-blur-xl dark:ring-white/10">
          <div>
            <p class="text-sm font-medium text-highlighted">Visible in discovery</p>
            <p class="text-xs text-muted">Preview profile components with live controls.</p>
          </div>
          <USwitch v-model="profile.visible" />
        </div>
      </UCard>

      <UCard :ui="{ header: 'space-y-1 p-5 sm:px-5', body: 'space-y-4 p-5 sm:p-5' }">
        <template #header>
          <h2 class="text-lg font-semibold text-highlighted">Profile Card</h2>
          <p class="text-sm text-muted">The dating surface should feel photographic, dimensional, and direct.</p>
        </template>
        <div class="relative overflow-hidden rounded-[2rem] bg-elevated/45 p-4 ring-1 ring-white/40 backdrop-blur-xl dark:ring-white/10">
          <div class="flex items-center gap-3">
            <UAvatar size="3xl" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80" />
            <div class="min-w-0 flex-1">
              <h3 class="truncate text-lg font-bold text-highlighted">Maya, 29</h3>
              <p class="line-clamp-2 text-sm text-muted">Weekend markets, quiet jazz bars, and long walks near the water.</p>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <UBadge v-for="tag in tags" :key="tag" color="neutral" variant="soft">{{ tag }}</UBadge>
          </div>
        </div>
      </UCard>

      <UCard :ui="{ header: 'space-y-1 p-5 sm:px-5', body: 'space-y-4 p-5 sm:p-5' }">
        <template #header>
          <h2 class="text-lg font-semibold text-highlighted">Feedback</h2>
          <p class="text-sm text-muted">System states use the same translucent container treatment.</p>
        </template>
        <UAlert
          color="success"
          variant="soft"
          icon="i-lucide-check"
          title="Profile saved"
          description="Changes are ready for the next discovery refresh."
        />
        <UAlert
          color="warning"
          variant="subtle"
          icon="i-lucide-shield-alert"
          title="Review pending"
          description="One photo still needs moderation before it appears publicly."
        />
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'dev-only',
});

const profile = reactive({
  displayName: 'Maya',
  bio: 'Weekend markets, quiet jazz bars, and long walks near the water.',
  visible: true,
});

const tags = ['Coffee', 'Design', 'Live music'];

const tones = [
  { label: 'Primary', class: 'bg-primary/15 text-primary' },
  { label: 'Secondary', class: 'bg-secondary/15 text-secondary' },
  { label: 'Warm', class: 'bg-warning/15 text-warning' },
];
</script>
