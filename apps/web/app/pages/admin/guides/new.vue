<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">
    <div class="mb-8">
      <Button variant="ghost" as-child class="mb-4">
        <NuxtLink to="/admin/guides">
          <IconArrowLeft class="w-4 h-4 mr-2" />
          Retour à la liste
        </NuxtLink>
      </Button>
      <h1 class="text-3xl font-bold">Créer un nouveau guide</h1>
    </div>

    <form @submit="onSubmit">
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
        @image-change="handleImageChange"
      />

      <div class="mt-8 flex justify-end gap-4">
        <Button type="button" variant="outline" as-child>
          <NuxtLink to="/admin/guides">Annuler</NuxtLink>
        </Button>
        <Button type="submit" :disabled="isSubmitting">
          <IconSave class="w-4 h-4 mr-2" />
          {{ isSubmitting ? 'Création...' : 'Créer le guide' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft as IconArrowLeft, Save as IconSave } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import GuideFormFields from '@/components/admin/GuideFormFields.vue'
import { useGuideForm } from '@/composables/useGuideForm'
import { useGuideFormData } from '@/composables/useGuideFormData'

definePageMeta({
  layout: 'admin',
})

const router = useRouter()

// Load form data
const { games, difficultyLevels, guideTypes, tags, seoKeywords } = useGuideFormData()

// Initialize form
const { form, handleSubmit, isSubmitting, values, handleImageChange, createGuide, handleError } =
  useGuideForm()

const onSubmit = handleSubmit(async (values) => {
  try {
    await createGuide(values)
    toast.success('Guide créé avec succès')

    // Clear the cache for admin-guides before navigation
    clearNuxtData('admin-guides')

    router.push('/admin/guides')
  } catch (error) {
    handleError(error)
  }
})

useHead({
  title: 'Nouveau Guide - Admin',
})
</script>
