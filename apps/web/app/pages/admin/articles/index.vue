<template>
  <div class="min-h-screen bg-background">
    <!-- Admin Header -->
    <header class="border-b">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Button variant="ghost" size="icon" @click="navigateTo('/admin')">
            <IconArrowLeft class="w-5 h-5" />
          </Button>
          <IconFileText class="w-6 h-6 text-primary" />
          <h1 class="text-2xl font-bold">Gestion des Articles</h1>
        </div>
        <Button @click="navigateTo('/admin/articles/new')">
          <IconPlus class="w-4 h-4 mr-2" />
          Nouvel Article
        </Button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Filters -->
      <Card class="mb-6">
        <CardContent class="pt-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  v-model="searchQuery"
                  placeholder="Rechercher un article..."
                  class="pl-10"
                />
              </div>
            </div>
            <Select v-model="filterGame">
              <SelectTrigger class="w-full md:w-[200px]">
                <SelectValue placeholder="Tous les jeux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les jeux</SelectItem>
                <SelectItem v-for="game in games" :key="game.id" :value="game.id.toString()">
                  {{ game.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select v-model="filterCategory">
              <SelectTrigger class="w-full md:w-[200px]">
                <SelectValue placeholder="Toutes catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                <SelectItem v-for="category in categories" :key="category.id" :value="category.id.toString()">
                  {{ category.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <!-- Articles Table -->
      <Card>
        <CardContent class="pt-6">
          <div class="space-y-4">
            <!-- Table Header -->
            <div class="grid grid-cols-12 gap-4 pb-3 border-b font-semibold text-sm">
              <div class="col-span-5">Titre</div>
              <div class="col-span-2">Jeu</div>
              <div class="col-span-2">Catégorie</div>
              <div class="col-span-2">Date</div>
              <div class="col-span-1 text-right">Actions</div>
            </div>

            <!-- Table Rows -->
            <div
              v-for="article in filteredArticles"
              :key="article.id"
              class="grid grid-cols-12 gap-4 py-3 border-b hover:bg-muted/50 transition-colors"
            >
              <div class="col-span-5 flex items-center gap-3">
                <NuxtImg
                  v-if="article.imageUrl"
                  :src="article.imageUrl"
                  :alt="article.title"
                  class="w-16 h-10 object-cover rounded"
                  width="64"
                  height="40"
                />
                <div class="flex-1 min-w-0">
                  <p class="font-medium truncate">{{ article.title }}</p>
                  <p class="text-sm text-muted-foreground">{{ article.author }}</p>
                </div>
              </div>
              <div class="col-span-2 flex items-center">
                <Badge variant="outline">{{ article.game?.name }}</Badge>
              </div>
              <div class="col-span-2 flex items-center">
                <Badge :variant="getCategoryVariant(article.category?.name)">
                  {{ article.category?.name }}
                </Badge>
              </div>
              <div class="col-span-2 flex items-center text-sm text-muted-foreground">
                {{ formatDate(article.publishedAt) }}
              </div>
              <div class="col-span-1 flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  @click="navigateTo(`/admin/articles/${article.slug}/edit`)"
                >
                  <IconEdit class="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" @click="deleteArticle(article.id)">
                  <IconTrash class="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeft as IconArrowLeft,
  FileText as IconFileText,
  Plus as IconPlus,
  Search as IconSearch,
  Edit as IconEdit,
  Trash as IconTrash
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useDate } from '@/composables/useDate'

const api = useApi()
const { formatDateShort: formatDate } = useDate()

// Fetch all articles from API
const { data: articles = [] } = await useAsyncData('admin-articles', async () => {
  const response = await api.api.articles.$get()
  return response.data?.data || []
})

// Fetch games and categories for filters
const { data: games = [] } = await useAsyncData('games', async () => {
  const response = await api.api.games.$get()
  return response.data?.data || []
})

const { data: categories = [] } = await useAsyncData('article-categories', async () => {
  const response = await api.api['article-categories'].$get()
  return response.data?.data || []
})

const searchQuery = ref('')
const filterGame = ref('all')
const filterCategory = ref('all')

const filteredArticles = computed(() => {
  return (articles.value || []).filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesGame = filterGame.value === 'all' || article.game?.id.toString() === filterGame.value
    const matchesCategory = filterCategory.value === 'all' || article.category?.id.toString() === filterCategory.value
    return matchesSearch && matchesGame && matchesCategory
  })
})

const getCategoryVariant = (category?: string) => {
  if (!category) return 'default'
  const variants: Record<string, any> = {
    'News': 'default',
    'Guide': 'secondary',
    'Événement': 'outline'
  }
  return variants[category] || 'default'
}

const deleteArticle = (id: number) => {
  // TODO: Implement delete with confirmation dialog
  console.log('Delete article:', id)
}

useHead({
  title: 'Gestion des Articles - Admin'
})
</script>
