<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Header -->
    <div class="mb-12 text-center">
      <div class="flex items-center justify-center gap-3 mb-4">
        <IconBook class="w-10 h-10 text-primary" />
        <h1 class="text-4xl md:text-5xl font-bold">Guides</h1>
      </div>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
        Des guides complets pour maîtriser vos jeux Gacha préférés et progresser efficacement
      </p>
    </div>

    <!-- Filters -->
    <div class="mb-8 flex flex-wrap gap-4">
      <Select v-model="selectedGame">
        <SelectTrigger class="w-[200px]">
          <SelectValue placeholder="Tous les jeux" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les jeux</SelectItem>
          <SelectItem v-for="game in games" :key="game.id" :value="game.slug">
            {{ game.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="selectedDifficulty">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Difficulté" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes</SelectItem>
          <SelectItem v-for="diff in difficultyLevels" :key="diff.id" :value="diff.id.toString()">
            {{ diff.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="selectedType">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Type de guide" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          <SelectItem v-for="type in guideTypes" :key="type.id" :value="type.id.toString()">
            {{ type.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Guides Grid -->
    <div v-if="guides && guides.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <GuideCard
        v-for="guide in guides"
        :key="guide.id"
        :title="guide.title"
        :summary="guide.summary"
        :author="guide.author"
        :game="guide.game?.name || 'Unknown Game'"
        :image="guide.image"
        :slug="guide.slug"
        :reading-time="guide.readingTime ?? undefined"
        :guide-type="guide.guideType?.name ?? undefined"
        :difficulty="guide.difficulty?.name ?? undefined"
        :view-count="guide.viewCount ?? 0"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-20">
      <IconBookOpen class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h2 class="text-2xl font-bold mb-2">Aucun guide disponible</h2>
      <p class="text-muted-foreground">Nos guides sont en cours de préparation. Revenez bientôt !</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Book as IconBook, BookOpen as IconBookOpen } from 'lucide-vue-next'
import GuideCard from '@/components/GuideCard.vue'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const api = useApi()

// Filters
const selectedGame = ref('all')
const selectedDifficulty = ref('all')
const selectedType = ref('all')

// Build query params
const queryParams = computed(() => {
  const params: any = {}
  if (selectedGame.value !== 'all') params.game = selectedGame.value
  if (selectedDifficulty.value !== 'all') params.difficultyId = selectedDifficulty.value
  if (selectedType.value !== 'all') params.guideTypeId = selectedType.value
  return params
})

// Fetch guides with filters
const {
  data: guides,
  refresh,
} = await useAsyncData(
  'guides-list',
  async () => {
    const response = await api.api.guides.$get({ query: queryParams.value })
    return response.data?.data || []
  },
  {
    watch: [queryParams],
  }
)

// Fetch filter data
const { data: games } = await useAsyncData('games-list', async () => {
  const response = await api.api.games.$get()
  return response.data?.data || []
})

const { data: difficultyLevels } = await useAsyncData('difficulty-levels', async () => {
  const response = await api.api['difficulty-levels'].$get()
  return response.data?.data || []
})

const { data: guideTypes } = await useAsyncData('guide-types', async () => {
  const response = await api.api['guide-types'].$get()
  return response.data?.data || []
})

useSeoMeta({
  title: 'Guides',
  description:
    'Découvrez nos guides complets pour maîtriser tous vos jeux Gacha : builds, stratégies, tier lists et astuces par des experts.',
  ogTitle: 'Guides - Gacha Pulse',
  ogDescription: 'Guides experts pour tous les jeux Gacha',
  ogType: 'website',
})

useHead({
  title: 'Guides - Gacha Pulse',
})
</script>
