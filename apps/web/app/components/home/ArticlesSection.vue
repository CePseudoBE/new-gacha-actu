<template>
  <section class="py-16 bg-background">
    <div class="container mx-auto px-4">
      <div class="mb-8">
        <h2 class="text-3xl font-bold mb-2">Dernières actualités</h2>
        <p class="text-muted-foreground">
          Restez informé des dernières nouveautés, mises à jour et événements de l'univers Gacha
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleCard
          v-for="article in props.articles"
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
  </section>
</template>

<script setup lang="ts">
import ArticleCard from '@/components/ArticleCard.vue'
import { useDate } from '@/composables/useDate'

interface Props {
  articles?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  articles: () => []
})

const { formatDate } = useDate()
</script>
