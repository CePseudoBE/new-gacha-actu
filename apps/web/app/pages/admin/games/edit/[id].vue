<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Modifier le Jeu</h1>
        <p class="text-muted-foreground">Mettre à jour les informations du jeu</p>
      </div>
      <Button variant="outline" @click="navigateTo('/admin/games')">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Retour
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Informations du jeu</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit" class="space-y-6">
          <GameFormFields
            :genres="genres || []"
            :platforms="platforms || []"
            :tags="tags || []"
            :current-image-url="game?.image?.url"
            :image-to-delete="imageToDelete"
            @quick-add="openQuickAdd"
            @image-change="handleImageChange"
            @delete-image="handleDeleteImage"
          />

          <div class="flex gap-3">
            <Button type="submit" :disabled="isSubmitting">
              <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
              Mettre à jour
            </Button>
            <Button
              type="button"
              variant="outline"
              @click="navigateTo('/admin/games')"
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <QuickAddDialog
      v-model="quickAddDialogOpen"
      :type="quickAddType"
      @success="handleQuickAddSuccess"
    />

    <DeleteDialog
      v-model:open="deleteImageDialogOpen"
      title="Supprimer l'image"
      description="Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible."
      @confirm="confirmDeleteImage"
    />
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GameFormFields from '@/components/admin/GameFormFields.vue'
import QuickAddDialog from '@/components/admin/QuickAddDialog.vue'
import DeleteDialog from '@/components/admin/DeleteDialog.vue'
import { useGameForm } from '@/composables/useGameForm'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const route = useRoute()
const api = useApi()
const gameId = Number(route.params.id)

// Fetch game data
const { data: game } = await useAsyncData(`game-${gameId}`, async () => {
  const response = await api.api.admin.games({ id: gameId }).$get()
  return response.data.data
})

if (!game.value) {
  throw createError({ statusCode: 404, message: 'Jeu non trouvé' })
}

// Fetch all necessary data
const { data: genres, refresh: refreshGenres } = await useAsyncData('genres', async () => {
  const response = await api.api.genres.$get()
  return response.data?.data || []
})

const { data: platforms, refresh: refreshPlatforms } = await useAsyncData('platforms', async () => {
  const response = await api.api.platforms.$get()
  return response.data?.data || []
})

const { data: tags, refresh: refreshTags } = await useAsyncData('tags', async () => {
  const response = await api.api.tags.$get()
  return response.data?.data || []
})

// Quick add dialog
const quickAddDialogOpen = ref(false)
const quickAddType = ref<'genre' | 'platform' | 'tag'>('genre')

const openQuickAdd = (type: 'genre' | 'platform' | 'tag') => {
  quickAddType.value = type
  quickAddDialogOpen.value = true
}

const handleQuickAddSuccess = () => {
  switch (quickAddType.value) {
    case 'genre':
      refreshGenres()
      break
    case 'platform':
      refreshPlatforms()
      break
    case 'tag':
      refreshTags()
      break
  }
}

// Prepare initial values from game data
const initialValues = {
  name: game.value?.name || '',
  description: game.value?.description || '',
  releaseDate: game.value?.releaseDate ? new Date(game.value.releaseDate).toISOString().split('T')[0] : '',
  isPopular: game.value?.isPopular || false,
  officialSite: game.value?.officialSite || '',
  wiki: game.value?.wiki || '',
  genreIds: game.value?.genres?.map((g: any) => g.id) || [],
  platformIds: game.value?.platforms?.map((p: any) => p.id) || [],
  tagIds: game.value?.tags?.map((t: any) => t.id) || [],
}

// Form handling - pass initial values to useGameForm
const {
  handleSubmit,
  isSubmitting,
  handleImageChange,
  updateGame,
  handleError,
  setFieldValue,
  values: formValues,
} = useGameForm(initialValues)

// Image deletion handling
const imageToDelete = ref(false)
const deleteImageDialogOpen = ref(false)

const handleDeleteImage = () => {
  deleteImageDialogOpen.value = true
}

const confirmDeleteImage = async () => {
  if (!game.value?.image?.id) return

  const response = await api.api.admin.images({ id: game.value.image.id }).$delete()

  if (response?.error || response?.status >= 400) {
    const errorData = response?.error?.value
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      errorData.errors.forEach((err: any) => {
        toast.error(err.message || 'Erreur de validation')
      })
    } else {
      const message = errorData?.message || 'Erreur lors de la suppression de l\'image'
      toast.error(message)
    }
    throw response
  }

  imageToDelete.value = true
  toast.success('Image supprimée avec succès')
  await refreshNuxtData(`game-${gameId}`)
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await updateGame(gameId, values)
    toast.success('Jeu mis à jour avec succès')
    navigateTo('/admin/games')
  } catch (error: any) {
    handleError(error)
  }
})

useHead({
  title: `Modifier ${game.value?.name || 'Jeu'} - Admin`,
})
</script>
