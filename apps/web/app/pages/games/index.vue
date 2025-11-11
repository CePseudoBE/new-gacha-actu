<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Header -->
    <div class="mb-12 text-center">
      <div class="flex items-center justify-center gap-3 mb-4">
        <IconGamepad class="w-10 h-10 text-primary" />
        <h1 class="text-4xl md:text-5xl font-bold">Jeux Gacha</h1>
      </div>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
        Retrouvez tous les jeux Gacha couverts par notre équipe avec guides, tier lists et actualités
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="game in games"
        :key="game.id"
        :to="`/games/${game.slug}`"
        class="block group"
      >
        <Card class="overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full">
          <div class="aspect-video relative overflow-hidden bg-muted">
            <NuxtImg
              v-if="game.image?.url"
              :src="game.image.url"
              :alt="game.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              width="400"
              height="225"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <IconGamepad class="w-16 h-16 text-muted-foreground/30" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <CardContent class="p-6">
            <h3 class="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{{ game.name }}</h3>
            <p class="text-sm text-muted-foreground line-clamp-2">{{ game.description }}</p>
            <div class="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Voir les articles</span>
              <IconArrowRight class="w-4 h-4 ml-1" />
            </div>
          </CardContent>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Gamepad2 as IconGamepad, ArrowRight as IconArrowRight } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'

const api = useApi()

// Fetch all games from API
const { data: games = [] } = await useAsyncData('all-games', async () => {
  const response = await api.api.games.$get()
  return response.data?.data || []
})

useHead({
  title: 'Jeux - Gacha Pulse'
})
</script>
