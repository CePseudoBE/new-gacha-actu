<template>
  <div class="space-y-6">
    <!-- Title -->
    <FormField v-slot="{ componentField }" name="title">
      <FormItem>
        <FormLabel>Titre *</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Titre de l'article" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Summary -->
    <FormField v-slot="{ componentField }" name="summary">
      <FormItem>
        <FormLabel>Résumé *</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Résumé court de l'article..."
            rows="3"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Content with Preview -->
    <FormField v-slot="{ componentField }" name="content">
      <FormItem>
        <div class="flex items-center justify-between mb-2">
          <FormLabel>Contenu (Markdown) *</FormLabel>
          <Button
            v-if="articleId"
            type="button"
            variant="outline"
            size="sm"
            @click="openImageGallery"
          >
            <ImageIcon class="w-4 h-4 mr-2" />
            Insérer une image
          </Button>
        </div>
        <FormControl>
          <Tabs default-value="edit" class="w-full">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Éditer</TabsTrigger>
              <TabsTrigger value="preview">Aperçu</TabsTrigger>
            </TabsList>
            <TabsContent value="edit" class="mt-3">
              <Textarea
                ref="contentTextarea"
                placeholder="Contenu de l'article en Markdown..."
                rows="20"
                class="font-mono text-sm"
                v-bind="componentField"
              />
              <FormDescription class="mt-2">
                Support du Markdown : **gras**, *italique*, # titres, etc.
              </FormDescription>
            </TabsContent>
            <TabsContent value="preview" class="mt-3">
              <div class="prose prose-sm prose-invert max-w-none p-4 border rounded-md min-h-[300px] bg-muted/30 [&>div>*:first-child]:mt-0">
                <div v-if="componentField.modelValue" v-html="parseMarkdown(componentField.modelValue)"></div>
                <p v-else class="text-muted-foreground">Aucun contenu à prévisualiser</p>
              </div>
            </TabsContent>
          </Tabs>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Author -->
    <FormField v-slot="{ componentField }" name="author">
      <FormItem>
        <FormLabel>Auteur *</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Nom de l'auteur" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Published At -->
    <FormField v-slot="{ componentField }" name="publishedAt">
      <FormItem>
        <FormLabel>Date de publication</FormLabel>
        <FormControl>
          <Input type="datetime-local" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Game -->
    <FormField v-slot="{ value, handleChange }" name="gameId">
      <FormItem>
        <FormLabel>Jeu *</FormLabel>
        <Select :model-value="value?.toString()" @update:model-value="(val) => handleChange(Number(val))">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un jeu" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem v-for="game in games" :key="game.id" :value="game.id.toString()">
              {{ game.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Category -->
    <FormField v-slot="{ value, handleChange }" name="categoryId">
      <FormItem>
        <div class="flex items-center justify-between">
          <FormLabel>Catégorie</FormLabel>
          <Button type="button" variant="outline" size="sm" @click="$emit('quickAdd', 'category')">
            <Plus class="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
        <Select :model-value="value?.toString()" @update:model-value="(val) => handleChange(val ? Number(val) : undefined)">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem v-for="category in categories" :key="category.id" :value="category.id.toString()">
              {{ category.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Tags -->
    <FormField v-slot="{ value, handleChange }" name="tagIds">
      <FormItem>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <FormLabel>Tags</FormLabel>
              <p class="text-sm text-muted-foreground">Sélectionnez les tags pertinents</p>
            </div>
            <Button type="button" variant="outline" size="sm" @click="$emit('quickAdd', 'tag')">
              <Plus class="w-4 h-4 mr-2" />
              Ajouter un tag
            </Button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg max-h-64 overflow-y-auto">
            <div
              v-for="tag in tags"
              :key="tag.id"
              class="flex items-center space-x-2"
            >
              <Checkbox
                :id="`tag-${tag.id}`"
                :model-value="!!(value && Array.isArray(value) && value.includes(tag.id))"
                @update:model-value="(checked) => {
                  const currentArray = Array.isArray(value) ? value : []
                  const newValue = checked
                    ? [...currentArray, tag.id]
                    : currentArray.filter(id => id !== tag.id)
                  handleChange(newValue)
                }"
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
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- SEO Keywords -->
    <FormField v-slot="{ value, handleChange }" name="seoKeywordIds">
      <FormItem>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <FormLabel>Mots-clés SEO</FormLabel>
              <p class="text-sm text-muted-foreground">Optimisez le référencement de l'article</p>
            </div>
            <Button type="button" variant="outline" size="sm" @click="$emit('quickAdd', 'seo-keyword')">
              <Plus class="w-4 h-4 mr-2" />
              Ajouter un mot-clé
            </Button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg max-h-64 overflow-y-auto">
            <div
              v-for="keyword in seoKeywords"
              :key="keyword.id"
              class="flex items-center space-x-2"
            >
              <Checkbox
                :id="`keyword-${keyword.id}`"
                :model-value="!!(value && Array.isArray(value) && value.includes(keyword.id))"
                @update:model-value="(checked) => {
                  const currentArray = Array.isArray(value) ? value : []
                  const newValue = checked
                    ? [...currentArray, keyword.id]
                    : currentArray.filter(id => id !== keyword.id)
                  handleChange(newValue)
                }"
              />
              <label
                :for="`keyword-${keyword.id}`"
                class="text-sm font-normal cursor-pointer leading-none"
              >
                {{ keyword.keyword }}
              </label>
            </div>
          </div>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Image Upload -->
    <FormField v-slot="{ componentField }" name="image">
      <FormItem>
        <FormLabel>Image</FormLabel>

        <!-- Current image preview -->
        <div v-if="currentImageUrl && !imageToDelete" class="mb-3 relative inline-block">
          <img :src="currentImageUrl" alt="Image actuelle" class="w-48 h-48 object-cover rounded-lg border" />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            class="absolute top-2 right-2"
            @click="$emit('deleteImage')"
          >
            <X class="w-4 h-4" />
          </Button>
        </div>

        <!-- File input (hidden if image exists) -->
        <FormControl v-if="!currentImageUrl || imageToDelete">
          <Input
            type="file"
            accept="image/*"
            @change="$emit('imageChange', $event)"
          />
        </FormControl>
        <FormDescription v-if="!currentImageUrl || imageToDelete">Format: PNG, JPG, WEBP (max 2MB)</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Meta Description -->
    <FormField v-slot="{ componentField }" name="metaDescription">
      <FormItem>
        <FormLabel>Meta Description (SEO)</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Description pour les moteurs de recherche..."
            rows="3"
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription>
          {{ componentField.modelValue?.length || 0 }} / 160 caractères
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Reading Time -->
    <FormField v-slot="{ componentField }" name="readingTime">
      <FormItem>
        <FormLabel>Temps de lecture (minutes)</FormLabel>
        <FormControl>
          <Input
            type="number"
            placeholder="5"
            min="1"
            max="120"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Is Popular -->
    <FormField v-slot="{ value, handleChange }" name="isPopular">
      <FormItem class="flex items-center justify-between rounded-lg border p-4">
        <div class="space-y-0.5">
          <FormLabel>Article populaire</FormLabel>
          <FormDescription>
            Afficher cet article dans les articles populaires
          </FormDescription>
        </div>
        <FormControl>
          <Switch :checked="value" @update:checked="handleChange" />
        </FormControl>
      </FormItem>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { Plus, X, Image as ImageIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
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
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useMarkdown } from '@/composables/useMarkdown'

const { parseMarkdown } = useMarkdown()

interface Props {
  games: any[]
  categories: any[]
  tags: any[]
  seoKeywords: any[]
  currentImageUrl?: string
  imageToDelete?: boolean
  articleId?: number
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'quickAdd', type: 'tag' | 'seo-keyword' | 'category'): void
  (e: 'imageChange', event: Event): void
  (e: 'deleteImage'): void
  (e: 'openImageGallery'): void
}>()

const contentTextarea = ref<InstanceType<typeof Textarea>>()

const openImageGallery = () => {
  emit('openImageGallery')
}

defineExpose({
  get contentTextarea() {
    return contentTextarea.value?.textareaRef
  }
})
</script>
