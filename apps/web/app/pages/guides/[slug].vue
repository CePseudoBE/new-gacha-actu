<template>
  <div v-if="guide" class="container mx-auto px-4 py-12 max-w-4xl">
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <Badge v-if="guide.game">{{ guide.game.name }}</Badge>
        <Badge v-if="guide.guideType" variant="outline">{{ guide.guideType.name }}</Badge>
        <Badge v-if="guide.difficulty" :variant="getDifficultyVariant(guide.difficulty.name)">
          {{ guide.difficulty.name }}
        </Badge>
      </div>

      <h1 class="text-4xl font-bold mt-4 mb-4">{{ guide.title }}</h1>

      <div class="flex items-center gap-4 text-sm text-muted-foreground">
        <span>Par {{ guide.author }}</span>
        <span>•</span>
        <span>{{ formatDate(guide.publishedAt) }}</span>
        <span v-if="guide.readingTime">•</span>
        <span v-if="guide.readingTime">{{ guide.readingTime }} min de lecture</span>
        <span>•</span>
        <span class="flex items-center gap-1">
          <IconEye class="w-4 h-4" />
          {{ guide.viewCount || 0 }} vues
        </span>
      </div>
    </div>

    <!-- Cover Image -->
    <div v-if="guide.image?.url" class="mb-8 rounded-lg overflow-hidden">
      <NuxtImg :src="guide.image.url" :alt="guide.title" class="w-full h-auto" width="800" height="400" />
    </div>

    <!-- Summary -->
    <div class="prose prose-dark prose-lg max-w-none mb-8">
      <p class="lead text-xl">{{ guide.summary }}</p>
    </div>

    <!-- Prerequisites -->
    <div v-if="guide.prerequisites && guide.prerequisites.length > 0" class="mb-8 p-6 border rounded-lg bg-muted/30">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <IconAlertCircle class="w-5 h-5 text-primary" />
        Prérequis
      </h2>
      <ul class="space-y-2">
        <li v-for="prerequisite in guide.prerequisites" :key="prerequisite.id" class="flex items-start gap-2">
          <IconCheck class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <span>{{ prerequisite.description }}</span>
        </li>
      </ul>
    </div>

    <!-- Table of Contents -->
    <div v-if="guide.sections && guide.sections.length > 1" class="mb-8 p-6 border rounded-lg">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <IconList class="w-5 h-5 text-primary" />
        Table des matières
      </h2>
      <nav class="space-y-2">
        <a
          v-for="section in guide.sections"
          :key="section.id"
          :href="`#section-${section.order}`"
          class="block text-sm hover:text-primary transition-colors"
        >
          {{ section.order + 1 }}. {{ section.title }}
        </a>
      </nav>
    </div>

    <!-- Sections -->
    <div class="space-y-12">
      <section
        v-for="section in guide.sections"
        :key="section.id"
        :id="`section-${section.order}`"
        class="scroll-mt-8"
      >
        <h2 class="text-2xl font-bold mb-4">
          {{ section.order + 1 }}. {{ section.title }}
        </h2>

        <!-- Section Image -->
        <div v-if="section.image?.url" class="mb-6 rounded-lg overflow-hidden">
          <NuxtImg
            :src="section.image.url"
            :alt="section.title"
            class="w-full h-auto"
            width="800"
            height="400"
          />
        </div>

        <!-- Section Content -->
        <ClientOnly>
          <div class="prose prose-dark prose-lg max-w-none" v-html="parseMarkdown(section.content)"></div>
        </ClientOnly>
      </section>
    </div>

    <!-- Tags -->
    <div v-if="guide.tags && guide.tags.length > 0" class="mt-12 pt-8 border-t">
      <div class="flex flex-wrap gap-2">
        <Badge v-for="tag in guide.tags" :key="tag.id" variant="outline">
          {{ tag.name }}
        </Badge>
      </div>
    </div>
  </div>

  <!-- Error state -->
  <div v-else class="container mx-auto px-4 py-12 text-center">
    <h1 class="text-2xl font-bold">Guide non trouvé</h1>
  </div>
</template>

<script setup lang="ts">
import {
  Eye as IconEye,
  AlertCircle as IconAlertCircle,
  Check as IconCheck,
  List as IconList,
} from 'lucide-vue-next'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { useMarkdown } from '@/composables/useMarkdown'
import { useDate } from '@/composables/useDate'
import { Badge } from '@/components/ui/badge'

const route = useRoute()
const api = useApi()
const { parseMarkdown } = useMarkdown()
const { formatDate } = useDate()

// Fetch guide from API
const { data: guide } = await useAsyncData(`guide-${route.params.slug}`, async () => {
  const { data } = await api.api.guides.slug({ slug: route.params.slug as string }).$get()

  if (!data?.data) {
    throw createError({ statusCode: 404, statusMessage: 'Guide non trouvé' })
  }

  return data.data
})

// Breadcrumb
const breadcrumbItems = computed(() => [
  { label: 'Accueil', href: '/' },
  { label: 'Guides', href: '/guides' },
  { label: guide.value?.title || 'Guide' }
])

const getDifficultyVariant = (difficulty?: string): 'default' | 'secondary' | 'destructive' => {
  if (!difficulty) return 'default'
  const upperDifficulty = difficulty.toUpperCase()
  const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
    FACILE: 'default',
    EASY: 'default',
    MOYEN: 'secondary',
    MEDIUM: 'secondary',
    DIFFICILE: 'destructive',
    HARD: 'destructive',
    EXPERT: 'destructive',
  }
  return variants[upperDifficulty] || 'default'
}

// SEO
useSeoMeta({
  title: guide.value?.title || 'Guide non trouvé',
  description: guide.value?.metaDescription || guide.value?.summary,
  ogTitle: guide.value?.title,
  ogDescription: guide.value?.metaDescription || guide.value?.summary,
  ogImage: guide.value?.image?.url,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: guide.value?.title,
  twitterDescription: guide.value?.metaDescription || guide.value?.summary,
  twitterImage: guide.value?.image?.url,
  articlePublishedTime: guide.value?.publishedAt,
  articleModifiedTime: guide.value?.updatedAt,
  articleAuthor: guide.value?.author ? [guide.value.author] : undefined,
  articleTag: guide.value?.tags?.map((tag: { name: string }) => tag.name),
})

// Structured Data (JSON-LD) - HowTo Schema
if (guide.value) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: guide.value.title,
          description: guide.value.summary,
          image: guide.value.image?.url,
          author: {
            '@type': 'Person',
            name: guide.value.author
          },
          datePublished: guide.value.publishedAt,
          dateModified: guide.value.updatedAt,
          step: guide.value.sections?.map((section: any, index: number) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: section.title,
            text: section.content?.substring(0, 200),
            image: section.image?.url
          })) || [],
          totalTime: guide.value.readingTime ? `PT${guide.value.readingTime}M` : undefined,
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'EUR',
            value: '0'
          }
        })
      }
    ]
  })
}

useHead({
  title: guide.value ? guide.value.title : 'Guide non trouvé',
})
</script>
