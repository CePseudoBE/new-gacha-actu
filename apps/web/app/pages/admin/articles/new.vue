<template>
  <div class="min-h-screen bg-background">
    <!-- Admin Header -->
    <header class="border-b">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Button variant="ghost" size="icon" @click="navigateTo('/admin/articles')">
            <IconArrowLeft class="w-5 h-5" />
          </Button>
          <IconFileText class="w-6 h-6 text-primary" />
          <h1 class="text-2xl font-bold">Nouvel Article</h1>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" @click="saveDraft">
            <IconSave class="w-4 h-4 mr-2" />
            Brouillon
          </Button>
          <Button @click="publishArticle">
            <IconCheck class="w-4 h-4 mr-2" />
            Publier
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8 max-w-5xl">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <Label for="title">Titre *</Label>
                <Input
                  id="title"
                  v-model="form.title"
                  placeholder="Titre de l'article"
                  required
                />
              </div>

              <div>
                <Label for="slug">Slug</Label>
                <Input
                  id="slug"
                  v-model="form.slug"
                  placeholder="titre-de-l-article"
                />
                <p class="text-xs text-muted-foreground mt-1">
                  Généré automatiquement depuis le titre
                </p>
              </div>

              <div>
                <Label for="summary">Résumé *</Label>
                <Textarea
                  id="summary"
                  v-model="form.summary"
                  placeholder="Résumé court de l'article"
                  rows="3"
                  required
                />
              </div>

              <div>
                <Label for="imageUrl">URL de l'image</Label>
                <Input
                  id="imageUrl"
                  v-model="form.imageUrl"
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contenu</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs default-value="edit">
                <TabsList class="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Éditer</TabsTrigger>
                  <TabsTrigger value="preview">Aperçu</TabsTrigger>
                </TabsList>
                <TabsContent value="edit" class="mt-4">
                  <Textarea
                    v-model="form.content"
                    placeholder="Contenu en Markdown..."
                    rows="20"
                    class="font-mono text-sm"
                  />
                  <p class="text-xs text-muted-foreground mt-2">
                    Support du Markdown : **gras**, *italique*, # titres, etc.
                  </p>
                </TabsContent>
                <TabsContent value="preview" class="mt-4">
                  <div class="prose prose-sm max-w-none dark:prose-invert p-4 border rounded-md min-h-[300px]">
                    <div v-html="previewContent"></div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <Label for="author">Auteur *</Label>
                <Input
                  id="author"
                  v-model="form.author"
                  placeholder="Nom de l'auteur"
                  required
                />
              </div>

              <div>
                <Label for="publishedAt">Date de publication</Label>
                <Input
                  id="publishedAt"
                  v-model="form.publishedAt"
                  type="datetime-local"
                />
              </div>

              <div class="flex items-center space-x-2">
                <input
                  id="isPopular"
                  v-model="form.isPopular"
                  type="checkbox"
                  class="rounded"
                />
                <Label for="isPopular" class="cursor-pointer">
                  Article populaire
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <Label for="game">Jeu *</Label>
                <Select v-model="form.gameId">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un jeu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Genshin Impact</SelectItem>
                    <SelectItem value="2">Honkai Star Rail</SelectItem>
                    <SelectItem value="3">Fire Emblem Heroes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label for="category">Catégorie</Label>
                <Select v-model="form.categoryId">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Guide</SelectItem>
                    <SelectItem value="2">News</SelectItem>
                    <SelectItem value="3">Événement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <Input
                  v-model="tagInput"
                  placeholder="Ajouter un tag..."
                  @keydown.enter.prevent="addTag"
                />
                <div class="flex flex-wrap gap-2 mt-2">
                  <Badge
                    v-for="tag in form.tags"
                    :key="tag"
                    variant="secondary"
                    class="cursor-pointer"
                    @click="removeTag(tag)"
                  >
                    {{ tag }}
                    <IconX class="w-3 h-3 ml-1" />
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <Label for="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  v-model="form.metaDescription"
                  placeholder="Description pour les moteurs de recherche"
                  rows="3"
                />
                <p class="text-xs text-muted-foreground mt-1">
                  {{ form.metaDescription?.length || 0 }} / 160 caractères
                </p>
              </div>

              <div>
                <Label for="readingTime">Temps de lecture (min)</Label>
                <Input
                  id="readingTime"
                  v-model.number="form.readingTime"
                  type="number"
                  placeholder="5"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import {
  ArrowLeft as IconArrowLeft,
  FileText as IconFileText,
  Save as IconSave,
  Check as IconCheck,
  X as IconX
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const form = ref({
  title: '',
  slug: '',
  summary: '',
  content: '',
  author: '',
  publishedAt: new Date().toISOString().slice(0, 16),
  imageUrl: '',
  metaDescription: '',
  readingTime: null as number | null,
  categoryId: '',
  gameId: '',
  isPopular: false,
  tags: [] as string[]
})

const tagInput = ref('')

const previewContent = computed(() => {
  if (!form.value.content) return '<p class="text-muted-foreground">Aucun contenu à prévisualiser</p>'
  return marked.parse(form.value.content)
})

watch(() => form.value.title, (newTitle) => {
  if (!form.value.slug) {
    form.value.slug = newTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
})

const addTag = () => {
  if (tagInput.value && !form.value.tags.includes(tagInput.value)) {
    form.value.tags.push(tagInput.value)
    tagInput.value = ''
  }
}

const removeTag = (tag: string) => {
  form.value.tags = form.value.tags.filter(t => t !== tag)
}

const saveDraft = () => {
  // TODO: Save as draft via API
  console.log('Save draft:', form.value)
}

const publishArticle = () => {
  // TODO: Validate and publish via API
  console.log('Publish article:', form.value)
}

useHead({
  title: 'Nouvel Article - Admin'
})
</script>
