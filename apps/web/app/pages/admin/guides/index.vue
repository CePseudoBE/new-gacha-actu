<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Gestion des Guides</h1>
      <Button as-child>
        <NuxtLink to="/admin/guides/new">
          <IconPlus class="w-4 h-4 mr-2" />
          Nouveau guide
        </NuxtLink>
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Liste des guides</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Jeu</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulté</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Vues</TableHead>
              <TableHead>Publié le</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="guide in guides" :key="guide.id">
              <TableCell class="font-medium">
                <NuxtLink :to="`/guides/${guide.slug}`" target="_blank" class="hover:underline">
                  {{ guide.title }}
                </NuxtLink>
              </TableCell>
              <TableCell>{{ guide.game?.name || 'N/A' }}</TableCell>
              <TableCell>{{ guide.guideType?.name || 'N/A' }}</TableCell>
              <TableCell>
                <Badge :variant="getDifficultyVariant(guide.difficulty?.name)">
                  {{ guide.difficulty?.name || 'N/A' }}
                </Badge>
              </TableCell>
              <TableCell>{{ guide.author }}</TableCell>
              <TableCell>{{ guide.viewCount || 0 }}</TableCell>
              <TableCell>{{ formatDate(guide.publishedAt) }}</TableCell>
              <TableCell>
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" as-child>
                    <NuxtLink :to="`/admin/guides/${guide.id}`">
                      <IconEdit class="w-4 h-4" />
                    </NuxtLink>
                  </Button>
                  <Button variant="destructive" size="sm" @click="handleDelete(guide.id, guide.title)">
                    <IconTrash class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div v-if="!guides || guides.length === 0" class="text-center py-8 text-muted-foreground">
          Aucun guide disponible. Créez-en un pour commencer !
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Plus as IconPlus, Edit as IconEdit, Trash as IconTrash } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useDate } from '@/composables/useDate'

const api = useApi()
const { formatDate } = useDate()

// Fetch guides
const { data: guides, refresh } = await useAsyncData('admin-guides', async () => {
  const response = await api.api.guides.$get()
  return response.data?.data || []
})

const getDifficultyVariant = (difficulty?: string) => {
  if (!difficulty) return 'default'
  const upperDifficulty = difficulty.toUpperCase()
  const variants: Record<string, any> = {
    FACILE: 'default',
    EASY: 'default',
    MOYEN: 'secondary',
    MEDIUM: 'secondary',
    DIFFICILE: 'destructive',
    HARD: 'destructive',
    EXPERT: 'destructive',
  }
  return variants[upperDifficulty] || 'default'
}

const handleDelete = async (id: number, title: string) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer le guide "${title}" ?`)) {
    return
  }

  try {
    await api.api.admin.guides[id].$delete()
    toast.success('Guide supprimé avec succès')

    // Clear cache and refresh
    clearNuxtData('admin-guides')
    await refresh()
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    toast.error('Erreur lors de la suppression du guide')
  }
}

useHead({
  title: 'Gestion des Guides - Admin',
})
</script>
