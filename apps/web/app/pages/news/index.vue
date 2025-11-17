<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-6">Actualités</h1>
    <p class="text-muted-foreground mb-8">Toutes les dernières actualités des jeux Gacha</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :title="article.title"
        :summary="article.summary"
        :author="article.author"
        :published-at="formatDate(article.publishedAt)"
        :game="article.game?.name || 'Unknown Game'"
        :image="article.image"
        :slug="article.slug"
        :reading-time="article.readingTime ?? undefined"
        :category="article.category?.name ?? undefined"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ArticleCard from '@/components/ArticleCard.vue'
import { useDate } from '@/composables/useDate'

const api = useApi()
const { formatDate } = useDate()

// Fetch all articles from API
const { data: articles = [] } = await useAsyncData('all-articles', async () => {
  const response = await api.api.articles.$get()
  return response.data?.data || []
})

// SEO
useSeoMeta({
  title: 'Actualités Jeux Gacha - News & Événements',
  description: 'Toutes les actualités des jeux gacha : nouveaux personnages, événements, bannières, mises à jour et news exclusives sur Genshin Impact, Honkai Star Rail et plus.',
  ogTitle: 'Actualités & News Jeux Gacha | Gacha Pulse',
  ogDescription: 'Dernières news, événements et mises à jour des jeux gacha',
  ogImage: '/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

// Structured Data
useHead({
  title: 'Actualités - Gacha Pulse',
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Actualités Jeux Gacha',
        description: 'Toutes les dernières actualités et news des jeux gacha',
        url: 'https://gachapulse.com/news',
        publisher: {
          '@type': 'Organization',
          name: 'Gacha Pulse',
          logo: {
            '@type': 'ImageObject',
            url: 'https://gachapulse.com/logo.png'
          }
        }
      })
    }
  ]
})
</script>
