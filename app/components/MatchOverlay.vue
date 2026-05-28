<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-105"
  >
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-3xl bg-primary/5">
      <div class="relative w-full max-w-sm overflow-hidden rounded-[3rem] kindred-glass-strong border-none shadow-2xl shadow-black/20">
        <!-- Confetti/Light effect background -->
        <div class="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/5" />
        
        <div class="relative flex flex-col items-center p-8 pt-12 text-center">
          <div class="flex items-center gap-4 mb-8">
            <div class="relative">
              <div class="absolute -inset-4 rounded-full bg-primary/20 blur-2xl animate-pulse" />
              <Avatar class="relative size-24 border-4 border-white shadow-xl">
                <AvatarImage :src="currentUserPhoto" />
              </Avatar>
            </div>
            <div class="relative -ml-8 mt-4">
              <div class="absolute -inset-4 rounded-full bg-primary/20 blur-2xl animate-pulse delay-700" />
              <Avatar class="relative size-24 border-4 border-white shadow-xl">
                <AvatarImage :src="matchedUserPhoto" />
              </Avatar>
              <div class="absolute -right-2 -top-2 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-white">
                <HeartIcon class="size-6 fill-current" />
              </div>
            </div>
          </div>

          <h2 class="kindred-gradient-text text-4xl font-black tracking-tighter">IT'S A MATCH!</h2>
          <p class="mt-4 text-base font-medium text-muted-foreground leading-relaxed">
            You and <span class="text-foreground font-bold">{{ matchedUserName }}</span> have liked each other.
          </p>

          <div class="mt-10 flex w-full flex-col gap-3">
            <Button size="lg" class="h-14 rounded-full text-base font-bold shadow-xl shadow-primary/25" @click="emit('chat')">
              <MessageCircleIcon data-icon="inline-start" class="size-5" />
              Send a Message
            </Button>
            <Button variant="ghost" size="lg" class="h-14 rounded-full text-base font-bold" @click="emit('close')">
              Keep Swiping
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { HeartIcon, MessageCircleIcon } from 'lucide-vue-next';
import { Avatar, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';

interface Props {
  isOpen: boolean;
  matchedUserName: string;
  matchedUserPhoto: string;
  currentUserPhoto: string;
}

defineProps<Props>();
const emit = defineEmits(['close', 'chat']);
</script>
