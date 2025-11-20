<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Créer un Jeu</h1>
        <p class="text-muted-foreground">Ajouter un nouveau jeu à la plateforme</p>
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
            @quick-add="openQuickAdd"
            @image-change="handleImageChange"
          />

          <div class="flex gap-3">
            <Button type="submit" :disabled="isSubmitting">
              <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
              Créer le jeu
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
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GameFormFields from '@/components/admin/GameFormFields.vue'
import QuickAddDialog from '@/components/admin/QuickAddDialog.vue'
import { useGameForm } from '@/composables/useGameForm'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const api = useApi()

// Fetch all necessary data
const { data: genres, refresh: refreshGenres } = await useAsyncData('genres', async () => {
  const { data: apiData } = await api.api.genres.$get()
  return apiData?.data || []
})

const { data: platforms, refresh: refreshPlatforms } = await useAsyncData('platforms', async () => {
  const { data: apiData } = await api.api.platforms.$get()
  return apiData?.data || []
})

const { data: tags, refresh: refreshTags } = await useAsyncData('tags', async () => {
  const { data: apiData } = await api.api.tags.$get()
  return apiData?.data || []
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

// Form handling
const {
  handleSubmit,
  isSubmitting,
  handleImageChange,
  createGame,
  handleError,
} = useGameForm()

const onSubmit = handleSubmit(async (values) => {
  try {
    await createGame(values)
    toast.success('Jeu créé avec succès')
    navigateTo('/admin/games')
  } catch (error: any) {
    handleError(error)
  }
})

useHead({
  title: 'Créer un Jeu - Admin',
})
</script>
