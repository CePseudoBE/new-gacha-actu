<template>
  <Dialog v-model:open="isOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          Ajoutez un nouvel élément à la liste
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Errors display -->
        <div v-if="errors.length > 0" class="rounded-lg border border-destructive bg-destructive/10 p-3">
          <ul class="space-y-1 text-sm text-destructive">
            <li v-for="(error, index) in errors" :key="index">
              • {{ error }}
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <Label for="quick-name">Nom *</Label>
          <Input id="quick-name" v-model="name" required />
        </div>
        <div v-if="showDescription" class="space-y-2">
          <Label for="quick-description">Description</Label>
          <Textarea id="quick-description" v-model="description" />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="isOpen = false">
            Annuler
          </Button>
          <Button type="submit" :disabled="isSubmitting">
            <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
            Ajouter
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  type: 'genre' | 'platform' | 'tag'
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const api = useApi()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const name = ref('')
const description = ref('')
const isSubmitting = ref(false)
const errors = ref<string[]>([])

const title = computed(() => {
  switch (props.type) {
    case 'genre': return 'Ajouter un genre'
    case 'platform': return 'Ajouter une plateforme'
    case 'tag': return 'Ajouter un tag'
  }
})

const showDescription = computed(() => props.type === 'genre')

watch(isOpen, (value) => {
  if (value) {
    name.value = ''
    description.value = ''
    errors.value = []
  }
})

const handleSubmit = async () => {
  isSubmitting.value = true
  errors.value = []

  try {
    const payload: any = { name: name.value }
    if (showDescription.value && description.value) {
      payload.description = description.value
    }

    let successMessage = ''
    let response: any = null

    switch (props.type) {
      case 'genre':
        response = await api.api.admin.genres.$post(payload)
        successMessage = 'Genre ajouté avec succès'
        break
      case 'platform':
        response = await api.api.admin.platforms.$post(payload)
        successMessage = 'Plateforme ajoutée avec succès'
        break
      case 'tag':
        response = await api.api.admin.tags.$post(payload)
        successMessage = 'Tag ajouté avec succès'
        break
    }

    if (response?.error || response?.status >= 400) {
      throw response
    }

    toast.success(successMessage)
    isOpen.value = false
    emit('success')
  } catch (error: any) {
    const errorData = error?.error?.value

    if (errorData?.errors && Array.isArray(errorData.errors)) {
      errors.value = errorData.errors.map((err: any) => err.message || 'Erreur de validation')
    } else {
      errors.value = [errorData?.message || 'Erreur lors de la création']
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
