<template>
  <div class="flex h-full flex-col">
    <AppHeader>
      <template #left>
        <div>
          <p class="text-xs font-semibold uppercase text-primary">Local only</p>
          <h1 class="cn-font-heading text-xl font-semibold text-foreground">Kindred UI Kit</h1>
        </div>
      </template>
      <template #right>
        <Badge variant="secondary">
          <FlaskConicalIcon data-icon="inline-start" />
          Dev
        </Badge>
      </template>
    </AppHeader>

    <div class="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
      <Card class="kindred-glass-strong kindred-sheen">
        <CardContent class="flex flex-col gap-4 p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Design direction</p>
            <h2 class="cn-font-heading mt-1 text-3xl font-semibold leading-tight text-foreground">
              Glass-first, warm, and tactile
            </h2>
          </div>
          <SparklesIcon class="size-7 text-primary" />
        </div>
        <p class="text-sm leading-6 text-muted-foreground">
          shadcn-vue provides the accessible component source. Kindred keeps semantic tokens and a
          small set of glass utilities so product screens can stay consistent without hand-styling
          each control.
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Primary commands use solid warmth; secondary controls stay translucent.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-2">
          <Button size="lg">
            <HeartIcon data-icon="inline-start" />
            Like
          </Button>
          <Button size="lg" variant="secondary">
            <MessageCircleIcon data-icon="inline-start" />
            Message
          </Button>
          <Button size="lg" variant="outline" class="border-warning/30 bg-warning/15 text-warning hover:bg-warning/20">
            <StarIcon data-icon="inline-start" />
            Super
          </Button>
          <Button size="icon-lg" variant="outline" aria-label="Dismiss">
            <XIcon />
          </Button>
        </div>
        <div class="flex items-center gap-3">
          <Button size="icon" variant="ghost" aria-label="Previous">
            <ChevronLeftIcon />
          </Button>
          <Button size="icon" variant="secondary" aria-label="Notifications">
            <BellIcon />
          </Button>
          <Button size="icon" variant="outline" aria-label="Settings">
            <Settings2Icon />
          </Button>
        </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forms</CardTitle>
          <CardDescription>Inputs keep the glass language but retain strong focus states.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel for="kit-display-name">Display name</FieldLabel>
            <Input id="kit-display-name" v-model="profile.displayName" />
          </Field>
          <Field>
            <FieldLabel for="kit-bio">Bio</FieldLabel>
            <Textarea id="kit-bio" v-model="profile.bio" :rows="3" />
          </Field>
        </FieldGroup>
        <div class="kindred-edge flex items-center justify-between rounded-xl bg-card/35 p-3 ring-1 ring-white/40 backdrop-blur-xl dark:ring-white/10">
          <div>
            <p class="text-sm font-medium text-foreground">Visible in discovery</p>
            <p class="text-xs text-muted-foreground">Preview profile components with live controls.</p>
          </div>
          <Switch v-model="profile.visible" />
        </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Card</CardTitle>
          <CardDescription>The dating surface should feel photographic, dimensional, and direct.</CardDescription>
        </CardHeader>
        <CardContent>
        <div class="kindred-edge relative overflow-hidden rounded-xl bg-muted/45 p-4 ring-1 ring-white/40 backdrop-blur-xl dark:ring-white/10">
          <div class="flex items-center gap-3">
            <Avatar class="size-16">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80" alt="Maya" />
              <AvatarFallback>MA</AvatarFallback>
            </Avatar>
            <div class="min-w-0 flex-1">
              <h3 class="truncate text-lg font-bold text-foreground">Maya, 29</h3>
              <p class="line-clamp-2 text-sm text-muted-foreground">Weekend markets, quiet jazz bars, and long walks near the water.</p>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <Badge v-for="tag in tags" :key="tag" variant="secondary">{{ tag }}</Badge>
          </div>
        </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>System states use the same translucent container treatment.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
        <Alert>
          <CheckIcon />
          <AlertTitle>Profile saved</AlertTitle>
          <AlertDescription>Changes are ready for the next discovery refresh.</AlertDescription>
        </Alert>
        <Alert>
          <ShieldAlertIcon />
          <AlertTitle>Review pending</AlertTitle>
          <AlertDescription>One photo still needs moderation before it appears publicly.</AlertDescription>
        </Alert>
        </CardContent>
      </Card>
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
  ShieldAlertIcon,
  SparklesIcon,
  StarIcon,
  XIcon,
} from 'lucide-vue-next';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
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
  { label: 'Secondary', class: 'bg-secondary/20 text-secondary-foreground ring-secondary/30' },
  { label: 'Warm', class: 'bg-warning/15 text-warning ring-warning/20' },
];
</script>
