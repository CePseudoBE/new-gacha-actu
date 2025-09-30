<template>
  <div class="md:hidden">
    <Sheet :open="isOpen" @update:open="(val) => $emit('toggle')">
      <SheetTrigger as-child>
        <Button variant="ghost" size="icon">
          <IconMenu class="h-6 w-6" />
          <span class="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" class="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav class="flex flex-col space-y-4 mt-6">
          <template v-for="item in config.items" :key="item.id">
            <div>
              <NuxtLink
                :to="item.href"
                class="text-lg font-medium hover:text-primary transition-colors"
                @click="$emit('toggle')"
              >
                {{ item.label }}
              </NuxtLink>
              <div v-if="item.children && item.children.length > 0" class="ml-4 mt-2 space-y-2">
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.id"
                  :to="child.href"
                  class="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  @click="$emit('toggle')"
                >
                  {{ child.label }}
                </NuxtLink>
              </div>
            </div>
          </template>
        </nav>

        <Separator class="my-6" />

        <div class="space-y-2">
          <h3 class="text-sm font-semibold">Communauté</h3>
          <div class="flex gap-3">
            <NuxtLink
              v-for="social in config.socialLinks"
              :key="social.id"
              :to="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.ariaLabel"
              class="text-muted-foreground hover:text-foreground transition-colors"
            >
              <IconDiscord v-if="social.name === 'Discord'" class="h-5 w-5" />
              <IconTwitter v-else-if="social.name === 'Twitter'" class="h-5 w-5" />
              <IconYoutube v-else-if="social.name === 'YouTube'" class="h-5 w-5" />
            </NuxtLink>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { Menu as IconMenu, Youtube as IconYoutube } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

interface Props {
  config: {
    items: Array<{
      id: string
      label: string
      href: string
      children?: Array<{
        id: string
        label: string
        href: string
      }>
    }>
    socialLinks: Array<{
      id: string
      name: string
      href: string
      ariaLabel: string
    }>
  }
  isOpen: boolean
}

defineProps<Props>()
defineEmits<{
  toggle: []
}>()
import IconDiscord from '@/components/icons/IconDiscord.vue'
import IconTwitter from '@/components/icons/IconTwitter.vue'
</script>
