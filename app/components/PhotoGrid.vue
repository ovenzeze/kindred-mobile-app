<template>
  <div class="grid grid-cols-3 gap-3">
    <!-- Existing Photos -->
    <div 
      v-for="(photo, index) in photos" 
      :key="photo.id || index"
      class="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-lg"
    >
      <NuxtImg 
        :src="photo.url" 
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      <!-- Overlay Actions -->
      <div class="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-2">
        <Button 
          variant="destructive" 
          size="icon-xs" 
          class="size-8 rounded-full shadow-lg"
          @click="emit('delete', photo.id)"
        >
          <Trash2Icon class="size-4" />
        </Button>
      </div>

      <!-- Order Badge -->
      <div class="absolute left-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/40 text-[10px] font-black text-white backdrop-blur-md ring-1 ring-white/20">
        {{ index + 1 }}
      </div>
    </div>

    <!-- Upload Placeholder / Button -->
    <button 
      v-if="photos.length < maxPhotos"
      class="kindred-tactile group relative aspect-[3/4] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 transition-all hover:bg-white/10 hover:border-primary/40"
      @click="triggerUpload"
      :disabled="uploading"
    >
      <div v-if="uploading" class="flex flex-col items-center gap-2">
        <Spinner class="size-6 text-primary" />
        <span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Uploading...</span>
      </div>
      <template v-else>
        <div class="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary/20">
          <PlusIcon class="size-6" />
        </div>
        <span class="mt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">Add Photo</span>
      </template>
      
      <input 
        ref="fileInput"
        type="file" 
        accept="image/*" 
        multiple
        class="hidden" 
        @change="handleFileChange"
      />
    </button>

    <!-- Empty Slots -->
    <div 
      v-for="i in Math.max(0, maxPhotos - photos.length - (uploading ? 1 : 0))" 
      :key="'empty-' + i"
      class="aspect-[3/4] rounded-2xl bg-white/5 ring-1 ring-white/5 opacity-50"
    />
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, Trash2Icon } from 'lucide-vue-next';
import { Button } from '~/components/ui/button';
import { Spinner } from '~/components/ui/spinner';

interface Photo {
  id: string;
  url: string;
}

interface Props {
  photos: Photo[];
  maxPhotos?: number;
  uploading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  maxPhotos: 6,
  uploading: false
});

const emit = defineEmits(['upload', 'delete', 'reorder']);

const fileInput = ref<HTMLInputElement | null>(null);

function triggerUpload() {
  fileInput.value?.click();
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    // Convert FileList to Array and emit
    emit('upload', Array.from(files));
    // Reset input
    if (fileInput.value) fileInput.value.value = '';
  }
}
</script>
