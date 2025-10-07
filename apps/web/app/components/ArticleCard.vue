<template>
  <article
    class="group border rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden hover:border-primary/20"
  >
    <div v-if="image?.url" class="relative h-48 overflow-hidden">
      <NuxtImg
        :src="image.url"
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        width="800"
        height="400"
      />
      <div class="absolute top-3 left-3">
        <Badge variant="secondary" class="bg-background/80 backdrop-blur">
          {{ game }}
        </Badge>
      </div>
      <div v-if="category" class="absolute top-3 right-3">
        <Badge :variant="getCategoryVariant(category)" class="backdrop-blur">
          {{ getCategoryLabel(category) }}
        </Badge>
      </div>
    </div>

    <div class="p-6 space-y-4 flex-1 flex flex-col">
      <NuxtLink :to="`/article/${slug}`" class="block">
        <h3
          class="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2"
        >
          {{ title }}
        </h3>
      </NuxtLink>

      <p class="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
        {{ summary }}
      </p>

      <div class="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
        <div class="flex items-center gap-2">
          <IconUser class="h-4 w-4" />
          <span>{{ author }}</span>
        </div>
        <div class="flex items-center gap-4">
          <div v-if="readingTime" class="flex items-center gap-1">
            <IconClock class="h-4 w-4" />
            <span>{{ readingTime }} min</span>
          </div>
          <div class="flex items-center gap-1">
            <IconCalendar class="h-4 w-4" />
            <span>{{ publishedAt }}</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { User as IconUser, Clock as IconClock, Calendar as IconCalendar } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'

interface Props {
  title: string
  summary: string
  author: string
  publishedAt: string
  game: string
  image?: { url: string } | null
  slug: string
  readingTime?: number
  category?: string
}

const props = defineProps<Props>()

const getCategoryVariant = (category?: string) => {
  if (!category) return 'default'
  const upperCategory = category.toUpperCase()
  const variants: Record<string, any> = {
    NEWS: 'default',
    GUIDE: 'secondary',
    'TIER LIST': 'destructive',
    'TIER_LIST': 'destructive',
    EVENT: 'outline',
    EVENEMENT: 'outline',
    ÉVÉNEMENT: 'outline'
  }
  return variants[upperCategory] || 'default'
}

const getCategoryLabel = (category?: string) => {
  return category || 'Article'
}
</script>
