<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Créer une Tier List</h1>
        <p class="text-muted-foreground">Créer un nouveau classement des personnages</p>
      </div>
      <Button variant="outline" @click="navigateTo('/admin/tier-lists')">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Retour
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Informations de la tier list</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit" class="space-y-6">
          <TierListFormFields
            :games="games || []"
            :tiers="tiers || []"
            @image-change="handleImageChange"
          />

          <div class="flex gap-3">
            <Button type="submit" :disabled="isSubmitting">
              <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
              Créer la tier list
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
import TierListFormFields from '@/components/admin/TierListFormFields.vue'
import { useTierListForm } from '@/composables/useTierListForm'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const api = useApi()

// Fetch all necessary data
const { data: games } = await useAsyncData('games-for-tierlist', async () => {
  const { data } = await api.api.games.$get()
  return data?.data || []
})

const { data: tiers } = await useAsyncData('tiers', async () => {
  const { data } = await api.api.tiers.$get()
  return data?.data || []
})

// Form handling
const {
  handleSubmit,
  isSubmitting,
  handleImageChange,
  createTierList,
  handleError,
} = useTierListForm()

const onSubmit = handleSubmit(async (values) => {
  try {
    await createTierList(values)
    toast.success('Tier list créée avec succès')
    navigateTo('/admin/tier-lists')
  } catch (error: any) {
    handleError(error)
  }
})

useHead({
  title: 'Créer une Tier List - Admin',
})
</script>
