<template>
  <div class="container mx-auto px-4 py-12">
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Header -->
    <div class="text-center mb-12">
      <div class="flex items-center justify-center gap-3 mb-4">
        <IconTrophy class="w-10 h-10 text-primary" />
        <h1 class="text-4xl md:text-5xl font-bold">Tier Lists</h1>
      </div>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        Découvrez les meilleurs personnages des jeux gacha selon nos experts
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="i in 6" :key="i" class="h-96 animate-pulse">
        <CardContent class="p-6">
          <div class="h-48 bg-muted rounded mb-4"></div>
          <div class="h-6 bg-muted rounded mb-2"></div>
          <div class="h-4 bg-muted rounded w-2/3"></div>
        </CardContent>
      </Card>
    </div>

    <!-- Tier Lists Grid -->
    <div v-else-if="tierLists && tierLists.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="tierList in tierLists"
        :key="tierList.id"
        :to="`/tier-lists/${tierList.slug}`"
        class="group"
      >
        <Card class="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
          <CardContent class="p-0">
            <!-- Image -->
            <div class="relative h-48 overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <NuxtImg
                v-if="tierList.image?.url"
                :src="tierList.image.url"
                :alt="tierList.title"
                class="w-full h-full object-cover transition-transform group-hover:scale-110"
                width="400"
                height="200"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <IconTrophy class="w-16 h-16 text-primary/40" />
              </div>

              <!-- Game Badge -->
              <div class="absolute top-3 left-3">
                <Badge v-if="tierList.game" class="bg-background/90 backdrop-blur">
                  {{ tierList.game.name }}
                </Badge>
              </div>

              <!-- Version Badge -->
              <div v-if="tierList.version" class="absolute top-3 right-3">
                <Badge variant="secondary" class="bg-background/90 backdrop-blur">
                  v{{ tierList.version }}
                </Badge>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {{ tierList.title }}
              </h3>

              <p v-if="tierList.description" class="text-sm text-muted-foreground mb-4 line-clamp-2">
                {{ tierList.description }}
              </p>

              <!-- Meta Info -->
              <div class="flex items-center gap-4 text-sm text-muted-foreground">
                <span class="flex items-center gap-1">
                  <IconEye class="w-4 h-4" />
                  {{ tierList.views || 0 }}
                </span>
                <span class="flex items-center gap-1" v-if="tierList.author">
                  <IconUser class="w-4 h-4" />
                  {{ tierList.author.fullName }}
                </span>
              </div>

              <!-- Categories -->
              <div v-if="tierList.categories && tierList.categories.length > 0" class="flex flex-wrap gap-2 mt-4">
                <Badge
                  v-for="category in tierList.categories.slice(0, 3)"
                  :key="category.id"
                  variant="outline"
                  class="text-xs"
                >
                  {{ category.name }}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <IconTrophy class="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h3 class="text-xl font-semibold mb-2">Aucune tier list disponible</h3>
      <p class="text-muted-foreground">Les tier lists arrivent bientôt !</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trophy as IconTrophy, Eye as IconEye, User as IconUser } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { TierList } from '@/types/models'

const api = useApi()

// Fetch published tier lists
const { data: tierLists, pending } = await useAsyncData('tier-lists', async () => {
  const { data } = await api.api['tier-lists'].$get({
    query: { isPublished: 'true' }
  })
  return data?.data || []
})

// Breadcrumb
const breadcrumbItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Tier Lists', to: '/tier-lists' },
]

// SEO
useHead({
  title: 'Tier Lists - Gacha Pulse',
})

useSeoMeta({
  title: 'Tier Lists - Gacha Pulse',
  description: 'Découvrez les meilleurs personnages des jeux gacha avec nos tier lists détaillées et à jour.',
  ogTitle: 'Tier Lists - Gacha Pulse',
  ogDescription: 'Découvrez les meilleurs personnages des jeux gacha avec nos tier lists détaillées et à jour.',
})
</script>
