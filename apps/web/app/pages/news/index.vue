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

useHead({
  title: 'Actualités - Gacha Pulse'
})
</script>
