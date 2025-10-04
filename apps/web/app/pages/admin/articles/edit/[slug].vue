<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Modifier l'Article</h1>
        <p class="text-muted-foreground">Mettre à jour les informations de l'article</p>
      </div>
      <Button variant="outline" @click="navigateTo('/admin/articles')">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Retour
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Informations de l'article</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit" class="space-y-6">
          <ArticleFormFields
            :games="games || []"
            :categories="categories || []"
            :tags="tags || []"
            :seo-keywords="seoKeywords || []"
            :current-image-url="article?.image?.url ? `http://localhost:3333${article.image.url}` : undefined"
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
              @click="navigateTo('/admin/articles')"
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
import ArticleFormFields from '@/components/admin/ArticleFormFields.vue'
import QuickAddDialog from '@/components/admin/QuickAddDialog.vue'
import DeleteDialog from '@/components/admin/DeleteDialog.vue'
import { useArticleForm } from '@/composables/useArticleForm'

definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const api = useApi()
const articleSlug = route.params.slug as string

// Fetch article data
const { data: article } = await useAsyncData(`article-${articleSlug}`, async () => {
  const response = await api.api.articles({ slug: articleSlug }).$get()
  return response.data.data
})

if (!article.value) {
  throw createError({ statusCode: 404, message: 'Article non trouvé' })
}

// Fetch all necessary data
const { data: games } = await useAsyncData('games', async () => {
  const response = await api.api.games.$get()
  return response.data?.data || []
})

const { data: categories, refresh: refreshCategories } = await useAsyncData('article-categories', async () => {
  const response = await api.api['article-categories'].$get()
  return response.data?.data || []
})

const { data: tags, refresh: refreshTags } = await useAsyncData('tags', async () => {
  const response = await api.api.tags.$get()
  return response.data?.data || []
})

const { data: seoKeywords, refresh: refreshSeoKeywords } = await useAsyncData('seo-keywords', async () => {
  const response = await api.api['seo-keywords'].$get()
  return response.data?.data || []
})

// Quick add dialog
const quickAddDialogOpen = ref(false)
const quickAddType = ref<'tag' | 'seo-keyword' | 'category'>('tag')

const openQuickAdd = (type: 'tag' | 'seo-keyword' | 'category') => {
  quickAddType.value = type
  quickAddDialogOpen.value = true
}

const handleQuickAddSuccess = () => {
  switch (quickAddType.value) {
    case 'tag':
      refreshTags()
      break
    case 'seo-keyword':
      refreshSeoKeywords()
      break
    case 'category':
      refreshCategories()
      break
  }
}

// Prepare initial values from article data
const initialValues = {
  title: article.value?.title || '',
  summary: article.value?.summary || '',
  author: article.value?.author || '',
  publishedAt: article.value?.publishedAt ? new Date(article.value.publishedAt).toISOString().slice(0, 16) : '',
  content: article.value?.content || '',
  metaDescription: article.value?.metaDescription || '',
  readingTime: article.value?.readingTime || undefined,
  categoryId: article.value?.category?.id || undefined,
  isPopular: article.value?.isPopular || false,
  gameId: article.value?.game?.id || undefined,
  tagIds: article.value?.tags?.map((t: any) => t.id) || [],
  seoKeywordIds: article.value?.seoKeywords?.map((k: any) => k.id) || [],
}

// Form handling
const {
  handleSubmit,
  isSubmitting,
  handleImageChange,
  updateArticle,
  handleError,
} = useArticleForm(initialValues)

// Image deletion handling
const imageToDelete = ref(false)
const deleteImageDialogOpen = ref(false)

const handleDeleteImage = () => {
  deleteImageDialogOpen.value = true
}

const confirmDeleteImage = async () => {
  if (!article.value?.image?.id) return

  const response = await api.api.admin.images({ id: article.value.image.id }).$delete()

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
  await refreshNuxtData(`article-${articleSlug}`)
}

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
