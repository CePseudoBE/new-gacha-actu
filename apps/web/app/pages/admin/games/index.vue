<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Gestion des Jeux</h1>
        <p class="text-muted-foreground">Gérer tous les jeux de la plateforme</p>
      </div>
      <Button @click="openCreateDialog">
        <Plus class="w-4 h-4 mr-2" />
        Nouveau Jeu
      </Button>
    </div>

    <!-- Games Table -->
    <Card>
      <CardHeader>
        <CardTitle>Liste des Jeux</CardTitle>
      </CardHeader>
      <CardContent>
        <Table v-if="games && games.length > 0">
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Genres</TableHead>
              <TableHead>Populaire</TableHead>
              <TableHead>Date de sortie</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="game in games" :key="game.id">
              <TableCell class="font-medium">{{ game.name }}</TableCell>
              <TableCell>
                <div class="flex gap-1 flex-wrap">
                  <Badge v-for="genre in game.genres" :key="genre.id" variant="outline">
                    {{ genre.name }}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <Badge :variant="game.isPopular ? 'default' : 'secondary'">
                  {{ game.isPopular ? 'Oui' : 'Non' }}
                </Badge>
              </TableCell>
              <TableCell>{{ formatDate(game.releaseDate) }}</TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" @click="editGame(game)">
                    <Pencil class="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" @click="deleteGame(game.id)">
                    <Trash class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div v-else class="text-center py-8 text-muted-foreground">
          Aucun jeu trouvé
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Plus, Pencil, Trash } from 'lucide-vue-next'
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

definePageMeta({
  layout: 'admin',
})

const api = useApi()
const { formatDate } = useDate()

// Fetch games
const { data: games, refresh } = await useAsyncData('admin-games', async () => {
  const response = await api.api.games.$get()
  return response.data?.data || []
})

const openCreateDialog = () => {
  // TODO: Open dialog for creating a new game
  navigateTo('/admin/games/new')
}

const editGame = (game: any) => {
  navigateTo(`/admin/games/${game.id}/edit`)
}

const deleteGame = async (id: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) return

  try {
    await api.api.admin.games({ id }).$delete()
    await refresh()
  } catch (error) {
    console.error('Error deleting game:', error)
    alert('Erreur lors de la suppression du jeu')
  }
}

useHead({
  title: 'Gestion des Jeux - Admin',
})
</script>
