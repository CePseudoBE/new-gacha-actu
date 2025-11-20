<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Modifier la Tier List</h1>
        <p class="text-muted-foreground">Mettre à jour le classement des personnages</p>
      </div>
      <Button variant="outline" @click="navigateTo('/admin/tier-lists')">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Retour
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="mt-4 text-muted-foreground">Chargement de la tier list...</p>
    </div>

    <!-- Error State -->
    <Card v-else-if="error">
      <CardContent class="py-12">
        <div class="text-center text-destructive">
          <p class="font-semibold">Erreur de chargement</p>
          <p class="text-sm">{{ error.message }}</p>
          <Button variant="outline" class="mt-4" @click="navigateTo('/admin/tier-lists')">
            Retour à la liste
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Edit Form -->
    <Card v-else-if="tierList">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>Informations de la tier list</CardTitle>
          <Badge :variant="tierList.isPublished ? 'default' : 'secondary'">
            {{ tierList.isPublished ? 'Publié' : 'Brouillon' }}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit" class="space-y-6">
          <TierListFormFields
            :games="games || []"
            :tiers="tiers || []"
            :current-image-url="tierList.image?.url"
            @image-change="handleImageChange"
          />

          <div class="flex gap-3">
            <Button type="submit" :disabled="isSubmitting">
              <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
              Enregistrer les modifications
            </Button>
            <Button
              type="button"
              variant="outline"
              @click="navigateTo('/admin/tier-lists')"
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import TierListFormFields from '@/components/admin/TierListFormFields.vue'
import { useTierListForm } from '@/composables/useTierListForm'
import type { TierList } from '@/types/models'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const route = useRoute()
const api = useApi()
const tierListId = parseInt(route.params.id as string)

// Fetch tier list data
const { data: tierList, pending, error } = await useAsyncData(`tier-list-${tierListId}`, async () => {
  const { data } = await api.api['tier-lists']({ id: tierListId }).$get()
  return data?.data
})

// Fetch all necessary data
const { data: games } = await useAsyncData('games-for-tierlist', async () => {
  const { data } = await api.api.games.$get()
  return data?.data || []
})

const { data: tiers } = await useAsyncData('tiers', async () => {
  const { data } = await api.api.tiers.$get()
  return data?.data || []
})

// Prepare initial values from existing tier list
const initialValues = computed(() => {
  if (!tierList.value) return {}

  return {
    gameId: tierList.value.gameId,
    title: tierList.value.title,
    description: tierList.value.description || '',
    version: tierList.value.version || '1.0',
    isPublished: tierList.value.isPublished,
    categories: tierList.value.categories?.map(cat => ({
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon || '',
      order: cat.order,
    })) || [],
    entries: tierList.value.entries?.map(entry => ({
      characterId: entry.characterId,
      tierId: entry.tierId,
      categoryId: entry.categoryId,
      notes: entry.notes || '',
      order: entry.order,
    })) || [],
  }
})

// Form handling
const {
  handleSubmit,
  isSubmitting,
  handleImageChange,
  updateTierList,
  handleError,
  setValues,
} = useTierListForm(initialValues.value)

// Update form values when tier list data is loaded
watch(initialValues, (newValues) => {
  if (newValues && Object.keys(newValues).length > 0) {
    setValues(newValues)
  }
}, { immediate: true })

const onSubmit = handleSubmit(async (values) => {
  try {
    await updateTierList(tierListId, values)
    toast.success('Tier list mise à jour avec succès')
    navigateTo('/admin/tier-lists')
  } catch (error: any) {
    handleError(error)
  }
})

useHead({
  title: `Modifier ${tierList.value?.title || 'Tier List'} - Admin`,
})
</script>
