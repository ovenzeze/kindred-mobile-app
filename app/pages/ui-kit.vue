<template>
  <div class="flex flex-col h-full">
    <AppHeader>
      <template #left>
        <div class="flex flex-col">
          <p class="kindred-section-kicker">Local only</p>
          <h1 class="kindred-section-title -mt-0.5">Kindred UI Kit</h1>
        </div>
      </template>
      <template #right>
        <Badge variant="secondary" class="rounded-full px-3 py-1">
          <FlaskConicalIcon data-icon="inline-start" class="size-3.5" />
          Refinement v2
        </Badge>
      </template>
    </AppHeader>

    <div class="kindred-page flex-1 overflow-y-auto">
      <Card class="kindred-glass-strong kindred-sheen rounded-[2.5rem] border-none">
        <CardContent class="flex flex-col gap-6 p-8">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="kindred-section-kicker">New direction</p>
              <h2 class="mt-2 text-3xl font-bold leading-tight tracking-tight text-foreground">
                Floating, Vibrant, and Pure
              </h2>
            </div>
            <div class="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <SparklesIcon class="size-6" />
            </div>
          </div>
          <p class="text-[1rem] leading-relaxed text-muted-foreground">
            We've removed rigid containers and "double-blur" effects. The UI now feels lighter,
            utilizing floating components and cleaner glass treatments for better focus.
          </p>
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="tone in tones"
              :key="tone.label"
              class="rounded-[1.25rem] p-4 text-center ring-1 ring-white/20 backdrop-blur-xl"
              :class="tone.class"
            >
              <p class="text-xs font-bold uppercase tracking-wider">{{ tone.label }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div class="grid gap-6">
        <section>
          <p class="kindred-section-kicker mb-3 ml-1">Core Actions</p>
          <div class="flex flex-wrap gap-3">
            <Button size="lg" class="rounded-full px-6">
              <HeartIcon data-icon="inline-start" />
              Primary
            </Button>
            <Button size="lg" variant="secondary" class="rounded-full px-6">
              <MessageCircleIcon data-icon="inline-start" />
              Support
            </Button>
            <Button size="icon-lg" variant="outline" class="size-14 rounded-full border-white/40 shadow-none backdrop-blur-md">
              <Settings2Icon class="size-6" />
            </Button>
          </div>
        </section>

        <section>
          <p class="kindred-section-kicker mb-3 ml-1">Surface Treatment</p>
          <DiscoveryCard
            name="Maya"
            :age="29"
            bio="Weekend markets, quiet jazz bars, and long walks near the water."
            image-url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=720&q=80"
            :tags="tags"
          />
        </section>

        <section>
          <p class="kindred-section-kicker mb-3 ml-1">Interactive Elements</p>
          <Card class="rounded-[2rem] border-none shadow-xl shadow-black/5">
            <CardContent class="flex flex-col gap-4 p-6">
              <FieldGroup>
                <Field>
                  <FieldLabel for="kit-display-name">Refined Input</FieldLabel>
                  <Input id="kit-display-name" v-model="profile.displayName" class="rounded-2xl" />
                </Field>
              </FieldGroup>
              <div class="kindred-edge flex items-center justify-between rounded-2xl bg-card/40 p-4 ring-1 ring-white/10 backdrop-blur-xl">
                <div>
                  <p class="text-sm font-bold text-foreground">Haptic Feedback</p>
                  <p class="text-xs text-muted-foreground">Components respond to touch physically.</p>
                </div>
                <Switch v-model="profile.visible" />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {
  BellIcon,
  CheckIcon,
  ChevronLeftIcon,
  FlaskConicalIcon,
  HeartIcon,
  MessageCircleIcon,
  Settings2Icon,
  SparklesIcon,
  StarIcon,
  XIcon,
} from 'lucide-vue-next';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Switch } from '~/components/ui/switch';
import { Textarea } from '~/components/ui/textarea';

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
  { label: 'Primary', class: 'bg-primary/15 text-primary ring-primary/15' },
  { label: 'Secondary', class: 'bg-secondary/25 text-secondary-foreground ring-secondary/30' },
  { label: 'Warm', class: 'bg-warning/15 text-warning ring-warning/20' },
];
</script>
