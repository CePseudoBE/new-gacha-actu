<template>
  <div class="flex items-center gap-3">
    <NuxtLink
      v-for="social in links"
      :key="social.id"
      :to="social.href"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="social.ariaLabel"
      class="text-muted-foreground hover:text-foreground transition-colors"
    >
      <component :is="getIcon(social.name)" class="h-5 w-5" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { Youtube as IconYoutube } from 'lucide-vue-next'
import IconDiscord from '@/components/icons/IconDiscord.vue'
import IconTwitter from '@/components/icons/IconTwitter.vue'

interface Props {
  links: Array<{
    id: string
    name: string
    href: string
    ariaLabel: string
  }>
  variant?: 'desktop' | 'mobile'
}

defineProps<Props>()

const getIcon = (name: string) => {
  switch (name) {
    case 'Discord':
      return IconDiscord
    case 'Twitter':
      return IconTwitter
    case 'YouTube':
      return IconYoutube
    default:
      return IconYoutube
  }
}
</script>
