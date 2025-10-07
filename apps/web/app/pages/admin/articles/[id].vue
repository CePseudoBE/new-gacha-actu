<template>
  <AdminFormLayout
    title="Modifier l'Article"
    description="Mettre à jour les informations de l'article"
    card-title="Informations de l'article"
    back-url="/admin/articles"
  >
    <form @submit="onSubmit" class="space-y-6">
      <ArticleFormFields
        :games="games || []"
        :categories="categories || []"
        :tags="tags || []"
        :seo-keywords="seoKeywords || []"
        :current-image-url="currentImageUrl"
        :image-to-delete="imageToDelete"
        @quick-add="openQuickAdd"
        @image-change="handleImageChange"
        @delete-image="handleDeleteImage"
      />

      <FormActions
        submit-label="Mettre à jour"
        :is-submitting="isSubmitting"
        cancel-url="/admin/articles"
      />
    </form>

    <template #dialogs>
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
    </template>
  </AdminFormLayout>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import AdminFormLayout from '@/components/admin/AdminFormLayout.vue'
import FormActions from '@/components/admin/FormActions.vue'
import ArticleFormFields from '@/components/admin/ArticleFormFields.vue'
import QuickAddDialog from '@/components/admin/QuickAddDialog.vue'
import DeleteDialog from '@/components/admin/DeleteDialog.vue'
import { useArticleForm } from '@/composables/useArticleForm'
import { useArticleFormData } from '@/composables/useArticleFormData'
import { useQuickAdd } from '@/composables/useQuickAdd'
import { useImageManagement } from '@/composables/useImageManagement'
import { useArticleInitialValues } from '@/composables/useArticleInitialValues'

definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const api = useApi()
const articleId = Number(route.params.id)

// Fetch article data
const { data: article } = await useAsyncData(`article-${articleId}`, async () => {
  const response = await api.api.articles[articleId].$get()
  return response.data.data
})

if (!article.value) {
  throw createError({ statusCode: 404, message: 'Article non trouvé' })
}

// Load form data
const { games, categories, tags, seoKeywords, refreshCategories, refreshTags, refreshSeoKeywords } =
  useArticleFormData()

// Quick add dialog
const { quickAddDialogOpen, quickAddType, openQuickAdd, handleQuickAddSuccess } = useQuickAdd({
  refreshCategories,
  refreshTags,
  refreshSeoKeywords,
})

// Image management
const { imageToDelete, deleteImageDialogOpen, getImageUrl, handleDeleteImage, deleteImage } =
  useImageManagement()

const currentImageUrl = computed(() => getImageUrl(article.value?.image?.url))

const confirmDeleteImage = async () => {
  if (!article.value?.image?.id) return
  await deleteImage(article.value.image.id, async () => {
    await refreshNuxtData(`article-${articleId}`)
  })
}

// Prepare initial values from article data
const initialValues = useArticleInitialValues(article.value)

// Form handling
const { handleSubmit, isSubmitting, handleImageChange, updateArticle, handleError } =
  useArticleForm(initialValues)

const onSubmit = handleSubmit(async (values) => {
  try {
    await updateArticle(article.value!.id, values)
    toast.success('Article mis à jour avec succès')
    navigateTo('/admin/articles')
  } catch (error: any) {
    handleError(error)
  }
})

useHead({
  title: `Modifier ${article.value?.title || 'Article'} - Admin`,
})
</script>
