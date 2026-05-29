<template>
  <div class="flex flex-col gap-6">
    <div v-for="field in fields" :key="field.key" class="space-y-2">
      <div class="flex items-center justify-between px-1">
        <Label :for="field.key" class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          {{ field.label }}
        </Label>
      </div>

      <!-- Tag / Interests Editor -->
      <template v-if="field.type === 'tags'">
        <div class="flex flex-wrap gap-2 rounded-[1.5rem] bg-white/5 p-4 ring-1 ring-white/10">
          <Badge 
            v-for="tag in (modelValue[field.key] || [])" 
            :key="tag"
            variant="secondary"
            class="rounded-full px-4 py-1.5 text-[0.75rem] font-bold bg-primary/10 text-primary border-none"
          >
            {{ tag }}
            <button @click="removeTag(field.key, tag)" class="ml-2 hover:text-destructive">
              <XIcon class="size-3" />
            </button>
          </Badge>
          <div class="flex items-center gap-2 w-full mt-2">
            <Input 
              v-model="newTagInputs[field.key]"
              placeholder="Add interest..."
              class="h-9 rounded-full bg-white/5 border-none ring-1 ring-white/5"
              @keydown.enter.prevent="addTag(field.key)"
            />
            <Button size="icon-sm" variant="secondary" class="rounded-full shrink-0" @click="addTag(field.key)">
              <PlusIcon class="size-4" />
            </Button>
          </div>
        </div>
      </template>

      <!-- Textarea for longer plans/bios -->
      <template v-else-if="field.type === 'textarea'">
        <Textarea 
          :id="field.key"
          v-model="modelValue[field.key]"
          :placeholder="field.placeholder"
          class="rounded-[1.5rem] bg-white/10 border-none ring-1 ring-white/10 focus-visible:ring-primary/30"
          :rows="4"
        />
      </template>

      <!-- Standard Input (Text/Number) -->
      <template v-else>
        <Input 
          :id="field.key"
          v-model="modelValue[field.key]"
          :type="field.type || 'text'"
          :placeholder="field.placeholder"
          class="h-12 rounded-[1.25rem] bg-white/10 border-none ring-1 ring-white/10 focus-visible:ring-primary/30"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, XIcon } from 'lucide-vue-next';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';

interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'tags' | 'select';
  placeholder?: string;
  options?: string[];
}

interface Props {
  fields: FieldConfig[];
  modelValue: Record<string, any>;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const newTagInputs = reactive<Record<string, string>>({});

function addTag(key: string) {
  const val = newTagInputs[key]?.trim();
  if (!val) return;
  
  const current = [...(props.modelValue[key] || [])];
  if (!current.includes(val)) {
    current.push(val);
    emit('update:modelValue', { ...props.modelValue, [key]: current });
  }
  newTagInputs[key] = '';
}

function removeTag(key: string, tag: string) {
  const current = (props.modelValue[key] || []).filter((t: string) => t !== tag);
  emit('update:modelValue', { ...props.modelValue, [key]: current });
}
</script>
