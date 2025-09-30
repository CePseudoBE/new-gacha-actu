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
        :image-url="article.imageUrl"
        :slug="article.slug"
        :reading-time="article.readingTime ?? undefined"
        :category="article.category?.name ?? undefined"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMockArticles } from '@/composables/useMockData'
import ArticleCard from '@/components/ArticleCard.vue'

const { articles } = useMockArticles()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

useHead({
  title: 'Actualités - Anime Gacha Pulse'
})
</script>
