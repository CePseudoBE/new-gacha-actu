<template>
  <div v-if="game" class="container mx-auto px-4 py-12">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">{{ game.name }}</h1>
      <p class="text-lg text-muted-foreground">{{ game.description }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ArticleCard
        v-for="article in gameArticles"
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

    <div v-if="gameArticles.length === 0" class="text-center py-20">
      <p class="text-xl text-muted-foreground">Aucun article pour ce jeu pour le moment</p>
    </div>
  </div>
  <div v-else class="container mx-auto px-4 py-12 text-center">
    <h1 class="text-2xl font-bold">Jeu non trouvé</h1>
  </div>
</template>

<script setup lang="ts">
import { useMockGames, useMockArticles } from '@/composables/useMockData'
import ArticleCard from '@/components/ArticleCard.vue'

const route = useRoute()
const { getGameBySlug } = useMockGames()
const { getArticlesByGame } = useMockArticles()

const game = computed(() => getGameBySlug(route.params.slug as string))
const gameArticles = computed(() =>
  game.value ? getArticlesByGame(game.value.slug) : []
)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

useHead({
  title: game.value ? `${game.value.name} - Anime Gacha Pulse` : 'Jeu non trouvé'
})
</script>
