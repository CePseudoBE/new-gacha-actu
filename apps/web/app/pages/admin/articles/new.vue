<template>
  <AdminFormLayout
    title="Créer un Article"
    description="Ajouter un nouvel article à la plateforme"
    card-title="Informations de l'article"
    back-url="/admin/articles"
  >
    <form @submit="onSubmit" class="space-y-6">
      <ArticleFormFields
        :games="games || []"
        :categories="categories || []"
        :tags="tags || []"
        :seo-keywords="seoKeywords || []"
        @quick-add="openQuickAdd"
        @image-change="handleImageChange"
      />

      <FormActions
        submit-label="Créer l'article"
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
    </template>
  </AdminFormLayout>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import AdminFormLayout from '@/components/admin/AdminFormLayout.vue'
import FormActions from '@/components/admin/FormActions.vue'
import ArticleFormFields from '@/components/admin/ArticleFormFields.vue'
import QuickAddDialog from '@/components/admin/QuickAddDialog.vue'
import { useArticleForm } from '@/composables/useArticleForm'
import { useArticleFormData } from '@/composables/useArticleFormData'
import { useQuickAdd } from '@/composables/useQuickAdd'

definePageMeta({
  layout: 'admin',
})

// Load form data
const { games, categories, tags, seoKeywords, refreshCategories, refreshTags, refreshSeoKeywords } =
  useArticleFormData()

// Quick add dialog
const { quickAddDialogOpen, quickAddType, openQuickAdd, handleQuickAddSuccess } = useQuickAdd({
  refreshCategories,
  refreshTags,
  refreshSeoKeywords,
})

// Form handling
const { handleSubmit, isSubmitting, handleImageChange, createArticle, handleError } =
  useArticleForm()

const onSubmit = handleSubmit(async (values) => {
  try {
    await createArticle(values)
    toast.success('Article créé avec succès')
    navigateTo('/admin/articles')
  } catch (error: any) {
    handleError(error)
  }
})

useHead({
  title: 'Créer un Article - Admin',
})
</script>
