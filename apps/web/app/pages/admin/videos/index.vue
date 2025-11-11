<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Vidéos YouTube</h1>
        <p class="text-muted-foreground mt-2">Gérez les vidéos YouTube affichées sur le site</p>
      </div>
      <Button @click="openNewVideoDialog">
        <Plus class="w-4 h-4 mr-2" />
        Ajouter une vidéo
      </Button>
    </div>

    <!-- Filters -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <Input
              v-model="searchQuery"
              placeholder="Rechercher par titre..."
              class="max-w-sm"
            />
          </div>
          <Select v-model="filterCategory">
            <SelectTrigger class="w-[200px]">
              <SelectValue placeholder="Toutes catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              <SelectItem value="guide">Guide</SelectItem>
              <SelectItem value="news">Actualité</SelectItem>
              <SelectItem value="gameplay">Gameplay</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="filterStatus">
            <SelectTrigger class="w-[200px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Videos Table -->
    <Card>
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aperçu</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Chaîne</TableHead>
              <TableHead>Publié le</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="isLoading">
              <TableCell colspan="7" class="text-center py-8">
                <div class="flex items-center justify-center gap-2">
                  <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Chargement...
                </div>
              </TableCell>
            </TableRow>
            <TableRow v-else-if="filteredVideos.length === 0">
              <TableCell colspan="7" class="text-center py-8 text-muted-foreground">
                Aucune vidéo trouvée
              </TableCell>
            </TableRow>
            <TableRow v-for="video in filteredVideos" v-else :key="video.id">
              <TableCell>
                <img
                  :src="video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/default.jpg`"
                  :alt="video.title"
                  class="w-24 h-14 object-cover rounded"
                />
              </TableCell>
              <TableCell>
                <div class="max-w-md">
                  <p class="font-medium line-clamp-2">{{ video.title }}</p>
                  <p v-if="video.description" class="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {{ video.description }}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge v-if="video.category" variant="outline">
                  {{ getCategoryLabel(video.category) }}
                </Badge>
              </TableCell>
              <TableCell>
                <p class="text-sm">{{ video.channelTitle || 'N/A' }}</p>
              </TableCell>
              <TableCell>
                <p class="text-sm">{{ formatDate(video.publishedAt) }}</p>
              </TableCell>
              <TableCell>
                <Switch
                  :checked="video.isActive"
                  @update:checked="toggleVideoStatus(video.id, $event)"
                />
              </TableCell>
              <TableCell class="text-right">
                <div class="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="openEditDialog(video)"
                  >
                    <Edit class="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="openDeleteDialog(video)"
                  >
                    <Trash2 class="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- New/Edit Video Dialog -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{{ editingVideo ? 'Modifier la vidéo' : 'Ajouter une vidéo YouTube' }}</DialogTitle>
          <DialogDescription>
            {{ editingVideo ? 'Modifiez les informations de la vidéo' : 'Ajoutez une nouvelle vidéo YouTube à votre site' }}
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="saveVideo" class="space-y-4">
          <div class="space-y-2">
            <Label for="videoId">ID ou URL de la vidéo YouTube *</Label>
            <Input
              id="videoId"
              v-model="formData.videoId"
              placeholder="dQw4w9WgXcQ ou https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              required
            />
            <p class="text-xs text-muted-foreground">
              L'ID est la partie après "v=" dans l'URL YouTube
            </p>
          </div>

          <div class="space-y-2">
            <Label for="title">Titre *</Label>
            <Input
              id="title"
              v-model="formData.title"
              placeholder="Titre de la vidéo"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="description">Description</Label>
            <Textarea
              id="description"
              v-model="formData.description"
              placeholder="Description courte de la vidéo"
              rows="3"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="category">Catégorie</Label>
              <Select v-model="formData.category">
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="news">Actualité</SelectItem>
                  <SelectItem value="gameplay">Gameplay</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="channelTitle">Nom de la chaîne</Label>
              <Input
                id="channelTitle"
                v-model="formData.channelTitle"
                placeholder="Nom de la chaîne YouTube"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="publishedAt">Date de publication</Label>
            <Input
              id="publishedAt"
              v-model="formData.publishedAt"
              type="date"
            />
          </div>

          <div class="flex items-center space-x-2">
            <Switch
              id="isActive"
              v-model:checked="formData.isActive"
            />
            <Label for="isActive" class="cursor-pointer">
              Afficher sur le site
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" @click="closeDialog">
              Annuler
            </Button>
            <Button type="submit" :disabled="isSaving">
              <span v-if="isSaving">Enregistrement...</span>
              <span v-else>{{ editingVideo ? 'Mettre à jour' : 'Ajouter' }}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <DeleteDialog
      v-model:open="isDeleteDialogOpen"
      :item-name="videoToDelete?.title || 'cette vidéo'"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'vue-sonner'
import DeleteDialog from '@/components/admin/DeleteDialog.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({
  title: 'Vidéos YouTube - Admin',
})

const config = useRuntimeConfig()

// State
const videos = ref<any[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const filterCategory = ref('all')
const filterStatus = ref('all')
const isDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const editingVideo = ref<any>(null)
const videoToDelete = ref<any>(null)
const isSaving = ref(false)

// Form data
const formData = ref({
  videoId: '',
  title: '',
  description: '',
  category: '',
  channelTitle: '',
  publishedAt: '',
  isActive: true,
})

// Computed
const filteredVideos = computed(() => {
  let result = videos.value

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(v =>
      v.title?.toLowerCase().includes(query) ||
      v.description?.toLowerCase().includes(query)
    )
  }

  // Filter by category
  if (filterCategory.value !== 'all') {
    result = result.filter(v => v.category === filterCategory.value)
  }

  // Filter by status
  if (filterStatus.value !== 'all') {
    const isActive = filterStatus.value === 'active'
    result = result.filter(v => v.isActive === isActive)
  }

  return result
})

// Methods
const fetchVideos = async () => {
  isLoading.value = true
  try {
    const response = await $fetch(`${config.public.apiUrl}/api/youtube-videos`, {
      credentials: 'include',
    })
    videos.value = response.data || []
  } catch (error) {
    console.error('Error fetching videos:', error)
    toast.error('Erreur lors du chargement des vidéos')
  } finally {
    isLoading.value = false
  }
}

const extractVideoId = (input: string): string => {
  // Si c'est déjà un ID (11 caractères alphanumériques)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input
  }

  // Extraire l'ID depuis une URL YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match) return match[1]
  }

  return input
}

const saveVideo = async () => {
  isSaving.value = true
  try {
    const payload = {
      ...formData.value,
      videoId: extractVideoId(formData.value.videoId),
    }

    if (editingVideo.value) {
      await $fetch(`${config.public.apiUrl}/api/youtube-videos/${editingVideo.value.id}`, {
        method: 'PUT',
        body: payload,
        credentials: 'include',
      })
      toast.success('Vidéo mise à jour avec succès')
    } else {
      await $fetch(`${config.public.apiUrl}/api/youtube-videos`, {
        method: 'POST',
        body: payload,
        credentials: 'include',
      })
      toast.success('Vidéo ajoutée avec succès')
    }

    await fetchVideos()
    closeDialog()
  } catch (error: any) {
    console.error('Error saving video:', error)
    toast.error(error?.data?.message || 'Erreur lors de l\'enregistrement')
  } finally {
    isSaving.value = false
  }
}

const toggleVideoStatus = async (id: string, isActive: boolean) => {
  try {
    await $fetch(`${config.public.apiUrl}/api/youtube-videos/${id}`, {
      method: 'PUT',
      body: { isActive },
      credentials: 'include',
    })

    const video = videos.value.find(v => v.id === id)
    if (video) {
      video.isActive = isActive
    }

    toast.success(isActive ? 'Vidéo activée' : 'Vidéo désactivée')
  } catch (error) {
    console.error('Error toggling video status:', error)
    toast.error('Erreur lors de la modification du statut')
  }
}

const openNewVideoDialog = () => {
  editingVideo.value = null
  formData.value = {
    videoId: '',
    title: '',
    description: '',
    category: '',
    channelTitle: '',
    publishedAt: '',
    isActive: true,
  }
  isDialogOpen.value = true
}

const openEditDialog = (video: any) => {
  editingVideo.value = video
  formData.value = {
    videoId: video.videoId,
    title: video.title,
    description: video.description || '',
    category: video.category || '',
    channelTitle: video.channelTitle || '',
    publishedAt: video.publishedAt ? new Date(video.publishedAt).toISOString().split('T')[0] : '',
    isActive: video.isActive,
  }
  isDialogOpen.value = true
}

const closeDialog = () => {
  isDialogOpen.value = false
  editingVideo.value = null
}

const openDeleteDialog = (video: any) => {
  videoToDelete.value = video
  isDeleteDialogOpen.value = true
}

const confirmDelete = async () => {
  if (!videoToDelete.value) return

  try {
    await $fetch(`${config.public.apiUrl}/api/youtube-videos/${videoToDelete.value.id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    toast.success('Vidéo supprimée avec succès')
    await fetchVideos()
  } catch (error) {
    console.error('Error deleting video:', error)
    toast.error('Erreur lors de la suppression')
  } finally {
    isDeleteDialogOpen.value = false
    videoToDelete.value = null
  }
}

const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    guide: 'Guide',
    news: 'Actualité',
    gameplay: 'Gameplay',
    review: 'Review',
    other: 'Autre',
  }
  return labels[category] || category
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Load data on mount
onMounted(() => {
  fetchVideos()
})
</script>
