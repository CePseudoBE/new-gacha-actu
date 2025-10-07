<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">Paramètres</h1>
      <p class="text-muted-foreground">Gérer les genres, plateformes, tags et autres données de référence</p>
    </div>

    <Tabs default-value="genres" class="w-full">
      <TabsList class="grid w-full grid-cols-5">
        <TabsTrigger value="genres">Genres</TabsTrigger>
        <TabsTrigger value="platforms">Plateformes</TabsTrigger>
        <TabsTrigger value="tags">Tags</TabsTrigger>
        <TabsTrigger value="guide-types">Types de guides</TabsTrigger>
        <TabsTrigger value="difficulty">Difficultés</TabsTrigger>
      </TabsList>

      <!-- Genres Tab -->
      <TabsContent value="genres" class="space-y-4">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle>Genres</CardTitle>
              <Button @click="openGenreDialog">
                <Plus class="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead class="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="genre in genres" :key="genre.id">
                  <TableCell class="font-medium">{{ genre.name }}</TableCell>
                  <TableCell>{{ genre.description }}</TableCell>
                  <TableCell class="text-right">
                    <Button variant="ghost" size="sm" @click="deleteGenre(genre.id)">
                      <Trash class="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Platforms Tab -->
      <TabsContent value="platforms" class="space-y-4">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle>Plateformes</CardTitle>
              <Button @click="openPlatformDialog">
                <Plus class="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead class="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="platform in platforms" :key="platform.id">
                  <TableCell class="font-medium">{{ platform.name }}</TableCell>
                  <TableCell class="text-right">
                    <Button variant="ghost" size="sm" @click="deletePlatform(platform.id)">
                      <Trash class="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Tags Tab -->
      <TabsContent value="tags" class="space-y-4">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle>Tags</CardTitle>
              <Button @click="openTagDialog">
                <Plus class="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead class="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="tag in tags" :key="tag.id">
                  <TableCell class="font-medium">{{ tag.name }}</TableCell>
                  <TableCell class="text-right">
                    <Button variant="ghost" size="sm" @click="deleteTag(tag.id)">
                      <Trash class="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Guide Types Tab -->
      <TabsContent value="guide-types" class="space-y-4">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle>Types de guides</CardTitle>
              <Button @click="openGuideTypeDialog">
                <Plus class="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead class="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="type in guideTypes" :key="type.id">
                  <TableCell class="font-medium">{{ type.name }}</TableCell>
                  <TableCell>{{ type.description }}</TableCell>
                  <TableCell class="text-right">
                    <Button variant="ghost" size="sm" @click="deleteGuideType(type.id)">
                      <Trash class="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Difficulty Levels Tab -->
      <TabsContent value="difficulty" class="space-y-4">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle>Niveaux de difficulté</CardTitle>
              <Button @click="openDifficultyDialog">
                <Plus class="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead class="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="level in difficultyLevels" :key="level.id">
                  <TableCell class="font-medium">{{ level.name }}</TableCell>
                  <TableCell>{{ level.description }}</TableCell>
                  <TableCell class="text-right">
                    <Button variant="ghost" size="sm" @click="deleteDifficultyLevel(level.id)">
                      <Trash class="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <!-- Generic Dialog for adding items -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ dialogTitle }}</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleDialogSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Nom *</Label>
            <Input id="name" v-model="formData.name" required />
          </div>
          <div v-if="showDescription" class="space-y-2">
            <Label for="description">Description</Label>
            <Textarea id="description" v-model="formData.description" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="dialogOpen = false">
              Annuler
            </Button>
            <Button type="submit" :disabled="isSubmitting">
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus, Trash } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'admin',
})

const api = useApi()
const { handleApiCall } = useApiErrorHandler()

// Fetch all reference data
const { data: genres, refresh: refreshGenres } = await useAsyncData('admin-genres', async () => {
  const response = await api.api.genres.$get()
  return response.data?.data || []
})

const { data: platforms, refresh: refreshPlatforms } = await useAsyncData('admin-platforms', async () => {
  const response = await api.api.platforms.$get()
  return response.data?.data || []
})

const { data: tags, refresh: refreshTags } = await useAsyncData('admin-tags', async () => {
  const response = await api.api.tags.$get()
  return response.data?.data || []
})

const { data: guideTypes, refresh: refreshGuideTypes } = await useAsyncData('admin-guide-types', async () => {
  const response = await api.api['guide-types'].$get()
  return response.data?.data || []
})

const { data: difficultyLevels, refresh: refreshDifficultyLevels } = await useAsyncData('admin-difficulty-levels', async () => {
  const response = await api.api['difficulty-levels'].$get()
  return response.data?.data || []
})

// Dialog state
const dialogOpen = ref(false)
const dialogTitle = ref('')
const dialogType = ref('')
const showDescription = ref(false)
const isSubmitting = ref(false)
const formData = ref({
  name: '',
  description: '',
})

const openGenreDialog = () => {
  dialogTitle.value = 'Ajouter un genre'
  dialogType.value = 'genre'
  showDescription.value = true
  formData.value = { name: '', description: '' }
  dialogOpen.value = true
}

const openPlatformDialog = () => {
  dialogTitle.value = 'Ajouter une plateforme'
  dialogType.value = 'platform'
  showDescription.value = false
  formData.value = { name: '', description: '' }
  dialogOpen.value = true
}

const openTagDialog = () => {
  dialogTitle.value = 'Ajouter un tag'
  dialogType.value = 'tag'
  showDescription.value = false
  formData.value = { name: '', description: '' }
  dialogOpen.value = true
}

const openGuideTypeDialog = () => {
  dialogTitle.value = 'Ajouter un type de guide'
  dialogType.value = 'guide-type'
  showDescription.value = true
  formData.value = { name: '', description: '' }
  dialogOpen.value = true
}

const openDifficultyDialog = () => {
  dialogTitle.value = 'Ajouter un niveau de difficulté'
  dialogType.value = 'difficulty'
  showDescription.value = true
  formData.value = { name: '', description: '' }
  dialogOpen.value = true
}

const handleDialogSubmit = async () => {
  isSubmitting.value = true
  const body: any = { name: formData.value.name }
  if (showDescription.value && formData.value.description) {
    body.description = formData.value.description
  }

  const apiCalls: Record<string, { call: () => Promise<any>; refresh: () => Promise<any> }> = {
    genre: {
      call: () => api.api.admin.genres.$post({ body }),
      refresh: refreshGenres,
    },
    platform: {
      call: () => api.api.admin.platforms.$post({ body }),
      refresh: refreshPlatforms,
    },
    tag: {
      call: () => api.api.admin.tags.$post({ body }),
      refresh: refreshTags,
    },
    'guide-type': {
      call: () => api.api.admin['guide-types'].$post({ body }),
      refresh: refreshGuideTypes,
    },
    difficulty: {
      call: () => api.api.admin['difficulty-levels'].$post({ body }),
      refresh: refreshDifficultyLevels,
    },
  }

  const selected = apiCalls[dialogType.value]
  if (selected) {
    await handleApiCall(selected.call, {
      successMessage: 'Élément créé avec succès',
      errorMessage: 'Erreur lors de la création',
      onSuccess: async () => {
        await selected.refresh()
        dialogOpen.value = false
      },
    })
  }

  isSubmitting.value = false
}

const deleteGenre = async (id: number) => {
  if (!confirm('Êtes-vous sûr ?')) return
  await handleApiCall(() => api.api.admin.genres({ id }).$delete(), {
    successMessage: 'Genre supprimé',
    errorMessage: 'Erreur lors de la suppression',
    onSuccess: refreshGenres,
  })
}

const deletePlatform = async (id: number) => {
  if (!confirm('Êtes-vous sûr ?')) return
  await handleApiCall(() => api.api.admin.platforms({ id }).$delete(), {
    successMessage: 'Plateforme supprimée',
    errorMessage: 'Erreur lors de la suppression',
    onSuccess: refreshPlatforms,
  })
}

const deleteTag = async (id: number) => {
  if (!confirm('Êtes-vous sûr ?')) return
  await handleApiCall(() => api.api.admin.tags({ id }).$delete(), {
    successMessage: 'Tag supprimé',
    errorMessage: 'Erreur lors de la suppression',
    onSuccess: refreshTags,
  })
}

const deleteGuideType = async (id: number) => {
  if (!confirm('Êtes-vous sûr ?')) return
  await handleApiCall(() => api.api.admin['guide-types']({ id }).$delete(), {
    successMessage: 'Type de guide supprimé',
    errorMessage: 'Erreur lors de la suppression',
    onSuccess: refreshGuideTypes,
  })
}

const deleteDifficultyLevel = async (id: number) => {
  if (!confirm('Êtes-vous sûr ?')) return
  await handleApiCall(() => api.api.admin['difficulty-levels']({ id }).$delete(), {
    successMessage: 'Niveau de difficulté supprimé',
    errorMessage: 'Erreur lors de la suppression',
    onSuccess: refreshDifficultyLevels,
  })
}

useHead({
  title: 'Paramètres - Admin',
})
</script>
