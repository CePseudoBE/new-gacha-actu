<template>
  <div class="flex items-center space-x-2">
    <IconGamepad class="h-7 w-7 text-primary" />
    <NuxtLink
      :to="href"
      class="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
    >
      {{ text }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { Gamepad as IconGamepad } from 'lucide-vue-next'

interface Props {
  text: string
  href: string
}

defineProps<Props>()
</script>
