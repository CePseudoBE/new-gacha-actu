<template>
  <nav aria-label="Fil d'Ariane" class="mb-6">
    <ol class="flex items-center gap-2 text-sm text-muted-foreground" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center gap-2"
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <NuxtLink
          v-if="item.href"
          :to="item.href"
          class="hover:text-primary transition-colors"
          itemprop="item"
        >
          <span itemprop="name">{{ item.label }}</span>
        </NuxtLink>
        <span v-else class="text-foreground font-medium" itemprop="name">{{ item.label }}</span>
        <meta itemprop="position" :content="String(index + 1)" />

        <IconChevronRight v-if="index < items.length - 1" class="w-4 h-4" />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRight as IconChevronRight } from 'lucide-vue-next'

export interface BreadcrumbItem {
  label: string
  href?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>
