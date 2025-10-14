<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">
    <div class="mb-8">
      <Button variant="ghost" as-child class="mb-4">
        <NuxtLink to="/admin/guides">
          <IconArrowLeft class="w-4 h-4 mr-2" />
          Retour à la liste
        </NuxtLink>
      </Button>
      <h1 class="text-3xl font-bold">Modifier le guide</h1>
    </div>

    <form v-if="guide" @submit="onSubmit" class="space-y-6">
      <GuideFormFields
        :form="form"
        :sections="values.sections"
        :prerequisites="values.prerequisites"
        :games="games || []"
        :guide-types="guideTypes || []"
        :difficulty-levels="difficultyLevels || []"
        :tags="tags || []"
        :seo-keywords="seoKeywords || []"
        :values="values"
        :current-image-url="currentImageUrl"
        :image-to-delete="imageToDelete"
        @image-change="handleImageChange"
        @delete-image="handleDeleteImage"
      />

      <div class="mt-8 flex justify-end gap-4">
        <Button type="button" variant="outline" as-child>
          <NuxtLink to="/admin/guides">Annuler</NuxtLink>
        </Button>
        <Button type="submit" :disabled="isSubmitting">
          <IconSave class="w-4 h-4 mr-2" />
          {{ isSubmitting ? 'Mise à jour...' : 'Mettre à jour le guide' }}
        </Button>
      </div>
    </form>

    <div v-else class="text-center py-20">
      <p class="text-muted-foreground">Chargement du guide...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft as IconArrowLeft, Save as IconSave } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import GuideFormFields from '@/components/admin/GuideFormFields.vue'
import { useGuideForm } from '@/composables/useGuideForm'
import { useGuideFormData } from '@/composables/useGuideFormData'
import { useImageManagement } from '@/composables/useImageManagement'

definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const router = useRouter()
const api = useApi()

const guideId = Number(route.params.id)

// Load form data
const { games, difficultyLevels, guideTypes, tags, seoKeywords } = useGuideFormData()

// Fetch guide
const { data: guide, refresh } = await useAsyncData(`admin-guide-${guideId}`, async () => {
  const response = await api.api.guides({ id: guideId }).$get()
  return response.data?.data
})

// Image management
const { imageToDelete, handleDeleteImage, getImageUrl } = useImageManagement()
const currentImageUrl = computed(() => getImageUrl(guide.value?.image?.url))

// Prepare initial values
const initialValues = computed(() => {
  if (!guide.value) return undefined

  return {
    title: guide.value.title,
    summary: guide.value.summary,
    author: guide.value.author,
    publishedAt: new Date(guide.value.publishedAt).toISOString().slice(0, 16),
    readingTime: guide.value.readingTime,
    difficultyId: guide.value.difficultyId,
    guideTypeId: guide.value.guideTypeId,
    isPopular: guide.value.isPopular,
    gameId: guide.value.gameId,
    metaDescription: guide.value.metaDescription || '',
    sections: guide.value.sections || [{ title: '', content: '', order: 0 }],
    prerequisites: guide.value.prerequisites || [],
    tagIds: guide.value.tags?.map((t: any) => t.id) || [],
    seoKeywordIds: guide.value.seoKeywords?.map((k: any) => k.id) || [],
  }
})

// Initialize form with loaded data
const { form, handleSubmit, isSubmitting, values, setValues, handleImageChange, updateGuide, handleError } =
  useGuideForm(initialValues.value)

// Update form when guide data loads
watch(
  () => guide.value,
  (newGuide) => {
    if (newGuide && initialValues.value) {
      setValues(initialValues.value as any)
    }
  },
  { immediate: true }
)

const onSubmit = handleSubmit(async (values) => {
  try {
    // Delete old image if requested
    if (imageToDelete.value && guide.value?.image?.id) {
      await api.api.admin.images[guide.value.image.id].$delete()
    }

    await updateGuide(guideId, values)
    toast.success('Guide mis à jour avec succès')
    await refresh()

    // Clear the cache for admin-guides before navigation
    clearNuxtData('admin-guides')

    router.push('/admin/guides')
  } catch (error) {
    handleError(error)
  }
})

useHead({
  title: `Modifier ${guide.value?.title || 'Guide'} - Admin`,
})
</script>
