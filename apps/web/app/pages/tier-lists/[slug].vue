<template>
  <div v-if="tierList" class="container mx-auto px-4 py-12 max-w-7xl">
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <Badge v-if="tierList.game">{{ tierList.game.name }}</Badge>
        <Badge v-if="tierList.version" variant="secondary">Version {{ tierList.version }}</Badge>
      </div>

      <h1 class="text-4xl md:text-5xl font-bold mt-4 mb-4">{{ tierList.title }}</h1>

      <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
        <span v-if="tierList.author" class="flex items-center gap-1">
          <IconUser class="w-4 h-4" />
          Par {{ tierList.author.fullName }}
        </span>
        <span>"</span>
        <span>{{ formatDate(tierList.createdAt) }}</span>
        <span>"</span>
        <span class="flex items-center gap-1">
          <IconEye class="w-4 h-4" />
          {{ tierList.views || 0 }} vues
        </span>
      </div>

      <p v-if="tierList.description" class="text-lg text-muted-foreground max-w-3xl">
        {{ tierList.description }}
      </p>
    </div>

    <!-- Categories Filter -->
    <div v-if="tierList.categories && tierList.categories.length > 0" class="mb-8 flex flex-wrap gap-2">
      <Button
        v-for="category in tierList.categories"
        :key="category.id"
        :variant="selectedCategory === category.id ? 'default' : 'outline'"
        size="sm"
        @click="selectedCategory = selectedCategory === category.id ? null : category.id"
        class="gap-2"
      >
        <span v-if="category.icon">{{ category.icon }}</span>
        {{ category.name }}
      </Button>
      <Button
        v-if="selectedCategory"
        variant="ghost"
        size="sm"
        @click="selectedCategory = null"
      >
        <IconX class="w-4 h-4" />
        R�initialiser
      </Button>
    </div>

    <!-- Tier List Display -->
    <div class="space-y-4">
      <div
        v-for="tier in orderedTiers"
        :key="tier.id"
        class="rounded-lg border overflow-hidden"
      >
        <!-- Tier Header -->
        <div
          class="flex items-center gap-4 px-6 py-4 font-bold text-lg"
          :style="{ backgroundColor: tier.color + '20', borderLeft: `4px solid ${tier.color}` }"
        >
          <div
            class="w-12 h-12 rounded flex items-center justify-center text-white font-bold text-xl"
            :style="{ backgroundColor: tier.color }"
          >
            {{ tier.name }}
          </div>
          <div>
            <div class="text-lg">{{ tier.label }}</div>
            <div v-if="tier.description" class="text-sm font-normal text-muted-foreground">
              {{ tier.description }}
            </div>
          </div>
          <div class="ml-auto text-sm font-normal text-muted-foreground">
            {{ getCharactersForTier(tier.id).length }} personnage(s)
          </div>
        </div>

        <!-- Characters Grid -->
        <div class="p-4 bg-card">
          <div v-if="getCharactersForTier(tier.id).length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <div
              v-for="entry in getCharactersForTier(tier.id)"
              :key="entry.id"
              class="group relative"
            >
              <Card class="overflow-hidden transition-all hover:shadow-lg hover:scale-105 hover:z-10">
                <CardContent class="p-0">
                  <!-- Character Image -->
                  <div class="aspect-square relative bg-gradient-to-br from-muted/50 to-muted">
                    <NuxtImg
                      v-if="entry.character?.image?.url"
                      :src="entry.character.image.url"
                      :alt="entry.character.name"
                      class="w-full h-full object-cover"
                      width="150"
                      height="150"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <IconUser class="w-12 h-12 text-muted-foreground/40" />
                    </div>

                    <!-- Rarity Badge -->
                    <div class="absolute top-2 right-2">
                      <Badge
                        :variant="getRarityVariant(entry.character?.rarity ?? undefined)"
                        class="text-xs px-1.5 py-0.5 bg-background/90 backdrop-blur"
                      >
                        {{ entry.character?.rarity }}
                      </Badge>
                    </div>

                    <!-- Limited Badge -->
                    <div v-if="entry.character?.isLimited" class="absolute top-2 left-2">
                      <Badge variant="destructive" class="text-xs px-1.5 py-0.5 bg-background/90 backdrop-blur">
                        <IconStar class="w-3 h-3" />
                      </Badge>
                    </div>
                  </div>

                  <!-- Character Info -->
                  <div class="p-2">
                    <div class="font-semibold text-sm line-clamp-1 mb-1">
                      {{ entry.character?.name }}
                    </div>
                    <div v-if="entry.character?.role" class="text-xs text-muted-foreground line-clamp-1">
                      {{ entry.character.role }}
                    </div>
                    <div v-if="entry.character?.element" class="text-xs text-muted-foreground line-clamp-1">
                      {{ entry.character.element }}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Tooltip on hover -->
              <div v-if="entry.notes" class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-20">
                <div class="bg-popover text-popover-foreground text-sm rounded-lg shadow-lg p-3 max-w-xs whitespace-normal">
                  <div class="font-semibold mb-1">{{ entry.character?.name }}</div>
                  <div class="text-xs">{{ entry.notes }}</div>
                  <div class="absolute left-1/2 -translate-x-1/2 top-full">
                    <div class="border-8 border-transparent border-t-popover"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-muted-foreground">
            Aucun personnage dans ce tier
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!orderedTiers || orderedTiers.length === 0" class="text-center py-12">
      <IconTrophy class="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h3 class="text-xl font-semibold mb-2">Tier list vide</h3>
      <p class="text-muted-foreground">Cette tier list est en cours de construction</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trophy as IconTrophy, User as IconUser, Eye as IconEye, Star as IconStar, X as IconX } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDate } from '@/composables/useDate'
import type { TierList, Tier, TierListEntry } from '@/types/models'

const route = useRoute()
const api = useApi()
const { formatDate } = useDate()

// Fetch tier list
const { data: tierList, pending, error } = await useAsyncData(`tier-list-${route.params.slug}`, async () => {
  const { data } = await api.api['tier-lists'].slug({ slug: route.params.slug as string }).$get()
  return data?.data
})

// Fetch all tiers
const { data: allTiers } = await useAsyncData('all-tiers', async () => {
  const { data } = await api.api.tiers.$get()
  return data?.data || []
})

// Selected category filter
const selectedCategory = ref<number | null>(null)

// Get ordered tiers
const orderedTiers = computed(() => {
  if (!allTiers.value) return []
  return [...allTiers.value].sort((a, b) => a.order - b.order)
})

// Get characters for a specific tier
const getCharactersForTier = (tierId: number) => {
  if (!tierList.value?.entries) return []

  return tierList.value.entries
    .filter(entry => {
      // Filter by tier
      if (entry.tierId !== tierId) return false

      // Filter by category if selected
      if (selectedCategory.value !== null && entry.categoryId !== selectedCategory.value) {
        return false
      }

      return true
    })
    .sort((a, b) => a.order - b.order)
}

// Get rarity variant
const getRarityVariant = (rarity?: string) => {
  if (!rarity) return 'secondary'

  switch (rarity.toUpperCase()) {
    case 'SSR':
    case 'UR':
      return 'default'
    case 'SR':
      return 'secondary'
    default:
      return 'outline'
  }
}

// Breadcrumb
const breadcrumbItems = computed(() => [
  { label: 'Accueil', to: '/' },
  { label: 'Tier Lists', to: '/tier-lists' },
  { label: tierList.value?.title || 'Chargement...', to: '' },
])

// SEO
useHead({
  title: () => tierList.value ? `${tierList.value.title} - Tier List - Gacha Pulse` : 'Tier List - Gacha Pulse',
})

useSeoMeta({
  title: () => tierList.value?.title || 'Tier List',
  description: () => tierList.value?.description || 'D�couvrez le classement des meilleurs personnages',
  ogTitle: () => tierList.value?.title || 'Tier List',
  ogDescription: () => tierList.value?.description || 'D�couvrez le classement des meilleurs personnages',
  ogImage: () => tierList.value?.image?.url,
})

// Handle 404
if (error.value) {
  throw createError({
    statusCode: 404,
    message: 'Tier list non trouv�e'
  })
}
</script>
