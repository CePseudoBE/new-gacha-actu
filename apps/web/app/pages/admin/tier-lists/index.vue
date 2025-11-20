<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Gestion des Tier Lists</h1>
        <p class="text-muted-foreground">Gérer toutes les tier lists de la plateforme</p>
      </div>
      <Button @click="openCreateDialog">
        <Plus class="w-4 h-4 mr-2" />
        Nouvelle Tier List
      </Button>
    </div>

    <!-- Tier Lists Table -->
    <Card>
      <CardHeader>
        <CardTitle>Liste des Tier Lists</CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Loading State -->
        <div v-if="pending" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-2 text-muted-foreground">Chargement des tier lists...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8 text-destructive">
          <p class="font-semibold">Erreur de chargement</p>
          <p class="text-sm">{{ error.message }}</p>
        </div>

        <!-- Content -->
        <Table v-else-if="tierLists && tierLists.length > 0">
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Jeu</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Publié</TableHead>
              <TableHead>Vues</TableHead>
              <TableHead>Date</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="tierList in tierLists" :key="tierList.id">
              <TableCell class="font-medium">{{ tierList.title }}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {{ tierList.game?.name || 'N/A' }}
                </Badge>
              </TableCell>
              <TableCell>{{ tierList.version || 'N/A' }}</TableCell>
              <TableCell>
                <Badge :variant="tierList.isPublished ? 'default' : 'secondary'">
                  {{ tierList.isPublished ? 'Publié' : 'Brouillon' }}
                </Badge>
              </TableCell>
              <TableCell>{{ tierList.views }}</TableCell>
              <TableCell>{{ formatDate(tierList.createdAt) }}</TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-2">
                  <Button
                    v-if="!tierList.isPublished"
                    variant="ghost"
                    size="sm"
                    @click="publishTierList(tierList)"
                    title="Publier"
                  >
                    <Eye class="w-4 h-4" />
                  </Button>
                  <Button
                    v-else
                    variant="ghost"
                    size="sm"
                    @click="unpublishTierList(tierList)"
                    title="Dépublier"
                  >
                    <EyeOff class="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" @click="editTierList(tierList)">
                    <Pencil class="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" @click="openDeleteDialog(tierList)">
                    <Trash class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Empty State -->
        <div v-else class="text-center py-8 text-muted-foreground">
          Aucune tier list trouvée
        </div>
      </CardContent>
    </Card>

    <DeleteDialog
      v-model:open="deleteDialogOpen"
      :title="`Supprimer ${tierListToDelete?.title}`"
      description="Êtes-vous sûr de vouloir supprimer cette tier list ? Cette action est irréversible."
      @confirm="confirmDeleteTierList"
    />
  </div>
</template>

<script setup lang="ts">
import { Plus, Pencil, Trash, Eye, EyeOff } from 'lucide-vue-next'
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
import DeleteDialog from '@/components/admin/DeleteDialog.vue'
import { useDate } from '@/composables/useDate'
import { useTierListForm } from '@/composables/useTierListForm'
import type { TierList } from '@/types/models'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const api = useApi()
const { handleApiCall } = useApiErrorHandler()
const { formatDate } = useDate()
const { publishTierList: publishFn, unpublishTierList: unpublishFn } = useTierListForm()

// Fetch tier lists
const { data: tierLists, pending, error, refresh } = await useAsyncData('admin-tier-lists', async () => {
  const { data } = await api.api['tier-lists'].$get()
  return data?.data || []
})

const openCreateDialog = () => {
  navigateTo('/admin/tier-lists/new')
}

const editTierList = (tierList: { id: number }) => {
  navigateTo(`/admin/tier-lists/${tierList.id}`)
}

const deleteDialogOpen = ref(false)
const tierListToDelete = ref<{ id: number; title: string } | null>(null)

const openDeleteDialog = (tierList: { id: number; title: string }) => {
  tierListToDelete.value = tierList
  deleteDialogOpen.value = true
}

const confirmDeleteTierList = async () => {
  if (!tierListToDelete.value) return

  await handleApiCall(
    () => api.api.admin['tier-lists']({ id: tierListToDelete.value!.id }).$delete(),
    {
      successMessage: 'Tier list supprimée avec succès',
      errorMessage: 'Erreur lors de la suppression de la tier list',
      onSuccess: async () => {
        await refresh()
        tierListToDelete.value = null
      }
    }
  )
}

const publishTierList = async (tierList: { id: number }) => {
  try {
    await publishFn(tierList.id)
    toast.success('Tier list publiée avec succès')
    await refresh()
  } catch (error: any) {
    toast.error('Erreur lors de la publication')
  }
}

const unpublishTierList = async (tierList: { id: number }) => {
  try {
    await unpublishFn(tierList.id)
    toast.success('Tier list dépubliée avec succès')
    await refresh()
  } catch (error: any) {
    toast.error('Erreur lors de la dépublication')
  }
}

useHead({
  title: 'Gestion des Tier Lists - Admin',
})
</script>
