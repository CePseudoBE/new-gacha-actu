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
          <!-- Name -->
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Nom du jeu *</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Genshin Impact" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Description -->
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description du jeu..."
                  rows="4"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Release Date -->
          <FormField v-slot="{ componentField }" name="releaseDate">
            <FormItem>
              <FormLabel>Date de sortie</FormLabel>
              <FormControl>
                <Input type="date" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Official Site -->
          <FormField v-slot="{ componentField }" name="officialSite">
            <FormItem>
              <FormLabel>Site officiel</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Wiki -->
          <FormField v-slot="{ componentField }" name="wiki">
            <FormItem>
              <FormLabel>Wiki</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://wiki.example.com"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Genres -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <Label>Genres *</Label>
                <p class="text-sm text-muted-foreground">Sélectionnez au moins un genre</p>
              </div>
              <Button type="button" variant="outline" size="sm" @click="openQuickAddDialog('genre')">
                <Plus class="w-4 h-4 mr-2" />
                Ajouter un genre
              </Button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg">
              <div
                v-for="genre in genres"
                :key="genre.id"
                class="flex items-center space-x-2"
              >
                <Checkbox
                  :id="`genre-${genre.id}`"
                  :checked="selectedGenres.includes(genre.id)"
                  @update:checked="(checked) => toggleGenre(genre.id, checked)"
                />
                <label
                  :for="`genre-${genre.id}`"
                  class="text-sm font-normal cursor-pointer leading-none"
                >
                  {{ genre.name }}
                </label>
              </div>
            </div>
            <p v-if="genreError" class="text-sm font-medium text-destructive">
              {{ genreError }}
            </p>
          </div>

          <!-- Platforms -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <Label>Plateformes</Label>
                <p class="text-sm text-muted-foreground">Sélectionnez les plateformes disponibles</p>
              </div>
              <Button type="button" variant="outline" size="sm" @click="openQuickAddDialog('platform')">
                <Plus class="w-4 h-4 mr-2" />
                Ajouter une plateforme
              </Button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg">
              <div
                v-for="platform in platforms"
                :key="platform.id"
                class="flex items-center space-x-2"
              >
                <Checkbox
                  :id="`platform-${platform.id}`"
                  :checked="selectedPlatforms.includes(platform.id)"
                  @update:checked="(checked) => togglePlatform(platform.id, checked)"
                />
                <label
                  :for="`platform-${platform.id}`"
                  class="text-sm font-normal cursor-pointer leading-none"
                >
                  {{ platform.name }}
                </label>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <Label>Tags</Label>
                <p class="text-sm text-muted-foreground">Ajoutez des tags pour améliorer le référencement</p>
              </div>
              <Button type="button" variant="outline" size="sm" @click="openQuickAddDialog('tag')">
                <Plus class="w-4 h-4 mr-2" />
                Ajouter un tag
              </Button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg">
              <div
                v-for="tag in tags"
                :key="tag.id"
                class="flex items-center space-x-2"
              >
                <Checkbox
                  :id="`tag-${tag.id}`"
                  :checked="selectedTags.includes(tag.id)"
                  @update:checked="(checked) => toggleTag(tag.id, checked)"
                />
                <label
                  :for="`tag-${tag.id}`"
                  class="text-sm font-normal cursor-pointer leading-none"
                >
                  {{ tag.name }}
                </label>
              </div>
            </div>
          </div>

          <!-- Image Upload -->
          <FormField v-slot="{ componentField }" name="image">
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  @change="handleImageChange"
                />
              </FormControl>
              <FormDescription>Format: PNG, JPG, WEBP (max 2MB)</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Is Popular -->
          <FormField v-slot="{ value, handleChange }" name="isPopular">
            <FormItem class="flex items-center justify-between rounded-lg border p-4">
              <div class="space-y-0.5">
                <FormLabel>Jeu populaire</FormLabel>
                <FormDescription>
                  Afficher ce jeu dans les jeux populaires
                </FormDescription>
              </div>
              <FormControl>
                <Switch :checked="value" @update:checked="handleChange" />
              </FormControl>
            </FormItem>
          </FormField>

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

    <!-- Quick Add Dialog -->
    <Dialog v-model:open="quickAddDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ quickAddTitle }}</DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel élément à la liste
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="handleQuickAdd" class="space-y-4">
          <!-- Errors display -->
          <div v-if="quickAddErrors.length > 0" class="rounded-lg border border-destructive bg-destructive/10 p-3">
            <ul class="space-y-1 text-sm text-destructive">
              <li v-for="(error, index) in quickAddErrors" :key="index">
                • {{ error }}
              </li>
            </ul>
          </div>

          <div class="space-y-2">
            <Label for="quick-name">Nom *</Label>
            <Input id="quick-name" v-model="quickAddName" required />
          </div>
          <div v-if="quickAddShowDescription" class="space-y-2">
            <Label for="quick-description">Description</Label>
            <Textarea id="quick-description" v-model="quickAddDescription" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="quickAddDialogOpen = false">
              Annuler
            </Button>
            <Button type="submit" :disabled="quickAddSubmitting">
              <Loader2 v-if="quickAddSubmitting" class="w-4 h-4 mr-2 animate-spin" />
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Loader2, Plus } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

// Use composable for toast
let toast: any = null
if (import.meta.client) {
  useToast().then(t => toast = t)
}

// Inline schema to avoid issues
const gameFormSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  releaseDate: z.string().optional(),
  isPopular: z.boolean(),
  officialSite: z.string().optional(),
  wiki: z.string().optional(),
})
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

definePageMeta({
  layout: 'admin',
})

const api = useApi()


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

// Selected items
const selectedGenres = ref<number[]>([])
const selectedPlatforms = ref<number[]>([])
const selectedTags = ref<number[]>([])
const selectedImage = ref<File | null>(null)
const genreError = ref<string>('')

const toggleGenre = (genreId: number, checked: boolean) => {
  if (checked) {
    selectedGenres.value.push(genreId)
  } else {
    selectedGenres.value = selectedGenres.value.filter(id => id !== genreId)
  }
  if (selectedGenres.value.length > 0) {
    genreError.value = ''
  }
}

const togglePlatform = (platformId: number, checked: boolean) => {
  if (checked) {
    selectedPlatforms.value.push(platformId)
  } else {
    selectedPlatforms.value = selectedPlatforms.value.filter(id => id !== platformId)
  }
}

const toggleTag = (tagId: number, checked: boolean) => {
  if (checked) {
    selectedTags.value.push(tagId)
  } else {
    selectedTags.value = selectedTags.value.filter(id => id !== tagId)
  }
}

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedImage.value = target.files[0]
  }
}

// Quick add dialog state
const quickAddDialogOpen = ref(false)
const quickAddType = ref<'genre' | 'platform' | 'tag'>('genre')
const quickAddTitle = ref('')
const quickAddShowDescription = ref(false)
const quickAddName = ref('')
const quickAddDescription = ref('')
const quickAddSubmitting = ref(false)
const quickAddErrors = ref<string[]>([])

const openQuickAddDialog = (type: 'genre' | 'platform' | 'tag') => {
  quickAddType.value = type
  quickAddName.value = ''
  quickAddDescription.value = ''
  quickAddErrors.value = []

  switch (type) {
    case 'genre':
      quickAddTitle.value = 'Ajouter un genre'
      quickAddShowDescription.value = true
      break
    case 'platform':
      quickAddTitle.value = 'Ajouter une plateforme'
      quickAddShowDescription.value = false
      break
    case 'tag':
      quickAddTitle.value = 'Ajouter un tag'
      quickAddShowDescription.value = false
      break
  }

  quickAddDialogOpen.value = true
}

const handleQuickAdd = async () => {
  quickAddSubmitting.value = true
  quickAddErrors.value = []

  try {
    const payload: any = { name: quickAddName.value }
    if (quickAddShowDescription.value && quickAddDescription.value) {
      payload.description = quickAddDescription.value
    }

    let successMessage = ''
    let response: any = null

    switch (quickAddType.value) {
      case 'genre':
        response = await api.api.admin.genres.$post(payload)
        if (response?.error || response?.status >= 400) {
          // Tuyau error already has the data parsed
          throw response
        }
        await refreshGenres()
        successMessage = 'Genre ajouté avec succès'
        break
      case 'platform':
        response = await api.api.admin.platforms.$post(payload)
        if (response?.error || response?.status >= 400) {
          throw response
        }
        await refreshPlatforms()
        successMessage = 'Plateforme ajoutée avec succès'
        break
      case 'tag':
        response = await api.api.admin.tags.$post(payload)
        if (response?.error || response?.status >= 400) {
          throw response
        }
        await refreshTags()
        successMessage = 'Tag ajouté avec succès'
        break
    }

    // Only show success if we got here without throwing
    if (toast) toast.success(successMessage)
    quickAddDialogOpen.value = false
  } catch (error: any) {
    // Tuyau stores the error body in error.error.value
    const errorData = error?.error?.value

    if (errorData?.errors && Array.isArray(errorData.errors)) {
      quickAddErrors.value = errorData.errors.map((err: any) => err.message || 'Erreur de validation')
    } else {
      quickAddErrors.value = [errorData?.message || 'Erreur lors de la création']
    }
  } finally {
    quickAddSubmitting.value = false
  }
}

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(gameFormSchema),
  initialValues: {
    name: '',
    description: '',
    releaseDate: '',
    isPopular: false,
    officialSite: '',
    wiki: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  // Validate genres manually
  if (selectedGenres.value.length === 0) {
    genreError.value = 'Sélectionnez au moins un genre'
    if (toast) toast.error('Sélectionnez au moins un genre')
    return
  }

  try {
    // Create FormData for image upload
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('description', values.description)
    if (values.releaseDate) formData.append('releaseDate', values.releaseDate)
    formData.append('isPopular', values.isPopular.toString())
    if (values.officialSite) formData.append('officialSite', values.officialSite)
    if (values.wiki) formData.append('wiki', values.wiki)

    // Add arrays as JSON strings
    formData.append('genreIds', JSON.stringify(selectedGenres.value))
    if (selectedPlatforms.value.length > 0) {
      formData.append('platformIds', JSON.stringify(selectedPlatforms.value))
    }
    if (selectedTags.value.length > 0) {
      formData.append('tagIds', JSON.stringify(selectedTags.value))
    }

    // Add image if selected
    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }

    await api.api.admin.games.$post({
      body: formData,
    })

    if (toast) toast.success('Jeu créé avec succès')
    navigateTo('/admin/games')
  } catch (error: any) {
    const errorData = error?.error?.value

    if (errorData?.errors && Array.isArray(errorData.errors) && toast) {
      errorData.errors.forEach((err: any) => {
        toast.error(err.message || 'Erreur de validation')
      })
    } else if (toast) {
      const message = errorData?.message || 'Erreur lors de la création du jeu'
      toast.error(message)
    }
  }
})

useHead({
  title: 'Créer un Jeu - Admin',
})
</script>
