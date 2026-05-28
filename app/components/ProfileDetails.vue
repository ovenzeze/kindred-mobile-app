<template>
  <div class="flex flex-col gap-8 pb-10">
    <!-- About Section -->
    <section v-if="about.weekendPlan || (about.interests && about.interests.length)" class="space-y-4">
      <div class="flex items-center gap-2 px-1">
        <SparklesIcon class="size-4 text-primary" />
        <h3 class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground/50">About</h3>
      </div>
      
      <div v-if="about.weekendPlan" class="kindred-glass-strong rounded-[2.5rem] p-7 border-none bg-primary/5 shadow-inner shadow-primary/5">
        <p class="text-[1.05rem] leading-relaxed font-medium italic text-foreground/90">
          "{{ about.weekendPlan }}"
        </p>
      </div>

      <div v-if="about.interests?.length" class="flex flex-wrap gap-2.5">
        <Badge 
          v-for="interest in about.interests" 
          :key="interest"
          variant="secondary"
          class="rounded-full px-5 py-2 text-[0.8rem] font-black border-none bg-white/10 text-foreground/80 ring-1 ring-white/10"
        >
          {{ interest }}
        </Badge>
      </div>
    </section>

    <!-- Work & Education -->
    <section v-if="work.title || work.company || education.university" class="space-y-4">
      <div class="flex items-center gap-2 px-1">
        <BriefcaseIcon class="size-4 text-primary" />
        <h3 class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Work & Education</h3>
      </div>
      
      <div class="kindred-glass-strong rounded-[2.5rem] p-6 space-y-6 border-none bg-white/10 dark:bg-white/5 shadow-none ring-1 ring-white/10">
        <div v-if="work.title || work.company" class="flex items-center gap-5">
          <div class="flex size-12 shrink-0 items-center justify-center rounded-[1.25rem] bg-primary/10 text-primary shadow-inner shadow-primary/5">
            <Building2Icon class="size-6" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-base font-black text-foreground truncate tracking-tight">{{ work.title || 'Professional' }}</p>
            <p class="text-sm font-bold text-muted-foreground/80 truncate">{{ work.company || 'Private Company' }}</p>
            <div v-if="work.department" class="mt-1 inline-flex rounded-full bg-primary/5 px-2 py-0.5 text-[0.6rem] font-black text-primary uppercase tracking-wider">
              {{ work.department }}
            </div>
          </div>
        </div>

        <div v-if="education.university" class="flex items-center gap-5">
          <div class="flex size-12 shrink-0 items-center justify-center rounded-[1.25rem] bg-primary/10 text-primary shadow-inner shadow-primary/5">
            <GraduationCapIcon class="size-6" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-base font-black text-foreground truncate tracking-tight">{{ education.university }}</p>
            <p class="text-sm font-bold text-muted-foreground/80">Alumni</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Basics -->
    <section class="space-y-4">
      <div class="flex items-center gap-2 px-1">
        <UserIcon class="size-4 text-primary" />
        <h3 class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground/50">The Basics</h3>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div v-if="basics.username" class="kindred-glass flex items-center gap-3 rounded-[1.25rem] p-3.5 border-none bg-white/10 dark:bg-white/5">
          <AtSignIcon class="size-4 text-primary/60" />
          <span class="text-[0.85rem] font-bold truncate">{{ basics.username }}</span>
        </div>
        <div v-if="basics.gender" class="kindred-glass flex items-center gap-3 rounded-[1.25rem] p-3.5 border-none bg-white/10 dark:bg-white/5">
          <UserIcon class="size-4 text-primary/60" />
          <span class="text-[0.85rem] font-bold">{{ basics.gender }}</span>
        </div>
        <div v-if="basics.orientation" class="kindred-glass flex items-center gap-3 rounded-[1.25rem] p-3.5 border-none bg-white/10 dark:bg-white/5">
          <HeartIcon class="size-4 text-primary/60" />
          <span class="text-[0.85rem] font-bold">{{ basics.orientation }}</span>
        </div>
        <div v-if="basics.city" class="kindred-glass flex items-center gap-3 rounded-[1.25rem] p-3.5 border-none bg-white/10 dark:bg-white/5">
          <MapPinIcon class="size-4 text-primary/60" />
          <span class="text-[0.85rem] font-bold truncate">{{ basics.city }}</span>
        </div>
      </div>
    </section>

    <!-- Appearance -->
    <section v-if="appearance.heightCm || appearance.eyeColor || appearance.hair" class="space-y-4">
      <div class="flex items-center gap-2 px-1">
        <EyeIcon class="size-4 text-primary" />
        <h3 class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Appearance</h3>
      </div>

      <div class="flex flex-wrap gap-3">
        <div v-if="appearance.heightCm" class="kindred-glass flex items-center gap-2.5 rounded-full px-5 py-2.5 border-none bg-white/10">
          <RulerIcon class="size-4 text-primary/60" />
          <span class="text-[0.85rem] font-bold">{{ appearance.heightCm }}cm</span>
        </div>
        <div v-if="appearance.eyeColor" class="kindred-glass flex items-center gap-2.5 rounded-full px-5 py-2.5 border-none bg-white/10">
          <div class="size-2 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
          <span class="text-[0.85rem] font-bold">{{ appearance.eyeColor }} Eyes</span>
        </div>
        <div v-if="appearance.hair" class="kindred-glass flex items-center gap-2.5 rounded-full px-5 py-2.5 border-none bg-white/10">
          <div class="size-2 rounded-full bg-foreground/20" />
          <span class="text-[0.85rem] font-bold">{{ appearance.hair }} Hair</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { 
  AtSignIcon, 
  BriefcaseIcon, 
  Building2Icon, 
  EyeIcon, 
  GraduationCapIcon, 
  HeartIcon, 
  MapPinIcon, 
  RulerIcon, 
  SparklesIcon, 
  UserIcon 
} from 'lucide-vue-next';
import { Badge } from '~/components/ui/badge';

interface FieldValue {
  fieldKey: string;
  value: any;
}

interface Props {
  fields: FieldValue[];
}

const props = defineProps<Props>();

const byKey = computed(() => {
  return Object.fromEntries((props.fields ?? []).map(f => [f.fieldKey, f.value ?? {}]));
});

const basics = computed(() => byKey.value.basics ?? {});
const work = computed(() => byKey.value.work ?? {});
const education = computed(() => byKey.value.education ?? {});
const about = computed(() => byKey.value.about ?? {});
const appearance = computed(() => byKey.value.appearance ?? {});
</script>
