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
        <!-- Loading State -->
        <div v-if="pending" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-2 text-muted-foreground">Chargement des jeux...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8 text-destructive">
          <p class="font-semibold">Erreur de chargement</p>
          <p class="text-sm">{{ error.message }}</p>
        </div>

        <!-- Content -->
        <Table v-else-if="games && games.length > 0">
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
                  <Button variant="ghost" size="sm" @click="openDeleteDialog(game)">
                    <Trash class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Empty State -->
        <div v-else class="text-center py-8 text-muted-foreground">
          Aucun jeu trouvé
        </div>
      </CardContent>
    </Card>

    <DeleteDialog
      v-model:open="deleteDialogOpen"
      :title="`Supprimer ${gameToDelete?.name}`"
      description="Êtes-vous sûr de vouloir supprimer ce jeu ? Cette action est irréversible."
      @confirm="confirmDeleteGame"
    />
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
import DeleteDialog from '@/components/admin/DeleteDialog.vue'
import { useDate } from '@/composables/useDate'
import type { Game } from '@/types/models'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const api = useApi()
const { handleApiCall } = useApiErrorHandler()
const { formatDate } = useDate()

// Fetch games
const { data: games, pending, error, refresh } = await useAsyncData('admin-games', async () => {
  const response = await api.api.games.$get()
  return response.data?.data || []
})

const openCreateDialog = () => {
  navigateTo('/admin/games/new')
}

const editGame = (game: Game) => {
  navigateTo(`/admin/games/edit/${game.id}`)
}

const deleteDialogOpen = ref(false)
const gameToDelete = ref<Game | null>(null)

const openDeleteDialog = (game: Game) => {
  gameToDelete.value = game
  deleteDialogOpen.value = true
}

const confirmDeleteGame = async () => {
  if (!gameToDelete.value) return

  await handleApiCall(
    () => api.api.admin.games({ id: gameToDelete.value!.id }).$delete(),
    {
      successMessage: 'Jeu supprimé avec succès',
      errorMessage: 'Erreur lors de la suppression du jeu',
      onSuccess: async () => {
        await refresh()
        gameToDelete.value = null
      }
    }
  )
}

useHead({
  title: 'Gestion des Jeux - Admin',
})
</script>
