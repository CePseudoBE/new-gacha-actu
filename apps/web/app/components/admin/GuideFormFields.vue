<template>
  <div class="space-y-6">
    <!-- Basic Information -->
    <Card>
      <CardHeader>
        <CardTitle>Informations générales</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel>Titre *</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Titre du guide" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="summary">
          <FormItem>
            <FormLabel>Résumé *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Résumé du guide (50-500 caractères)"
                v-bind="componentField"
                rows="3"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="grid grid-cols-2 gap-4">
          <FormField v-slot="{ componentField }" name="author">
            <FormItem>
              <FormLabel>Auteur *</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nom de l'auteur" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="publishedAt">
            <FormItem>
              <FormLabel>Date de publication *</FormLabel>
              <FormControl>
                <Input type="datetime-local" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <FormField v-slot="{ value, handleChange }" name="gameId">
            <FormItem>
              <FormLabel>Jeu *</FormLabel>
              <Select :model-value="value?.toString()" @update:model-value="(val) => handleChange(Number(val))">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un jeu" />
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

          <FormField v-slot="{ value, handleChange }" name="guideTypeId">
            <FormItem>
              <FormLabel>Type de guide *</FormLabel>
              <Select :model-value="value?.toString()" @update:model-value="(val) => handleChange(Number(val))">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    v-for="type in guideTypes"
                    :key="type.id"
                    :value="type.id.toString()"
                  >
                    {{ type.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, handleChange }" name="difficultyId">
            <FormItem>
              <FormLabel>Difficulté *</FormLabel>
              <Select :model-value="value?.toString()" @update:model-value="(val) => handleChange(Number(val))">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulté" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    v-for="diff in difficultyLevels"
                    :key="diff.id"
                    :value="diff.id.toString()"
                  >
                    {{ diff.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <FormField v-slot="{ componentField }" name="readingTime">
          <FormItem>
            <FormLabel>Temps de lecture (minutes)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Ex: 10" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="isPopular">
          <FormItem class="flex items-center gap-2">
            <FormControl>
              <Checkbox v-bind="componentField" />
            </FormControl>
            <FormLabel class="!mt-0">Guide populaire (mis en avant)</FormLabel>
            <FormMessage />
          </FormItem>
        </FormField>
      </CardContent>
    </Card>

    <!-- Sections -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>Sections du guide *</CardTitle>
          <Button type="button" size="sm" @click="addSection">
            <IconPlus class="w-4 h-4 mr-2" />
            Ajouter une section
          </Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div
          v-for="(section, index) in sections"
          :key="index"
          class="p-4 border rounded-lg space-y-3"
        >
          <div class="flex items-center justify-between">
            <h4 class="font-semibold">Section {{ index + 1 }}</h4>
            <Button
              v-if="sections.length > 1"
              type="button"
              variant="destructive"
              size="sm"
              @click="removeSection(index)"
            >
              <IconTrash class="w-4 h-4" />
            </Button>
          </div>

          <FormField v-slot="{ componentField }" :name="`sections.${index}.title`">
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Titre de la section" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" :name="`sections.${index}.content`">
            <FormItem>
              <FormLabel>Contenu (Markdown)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Contenu de la section en Markdown..."
                  v-bind="componentField"
                  rows="6"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" :name="`sections.${index}.order`">
            <FormItem>
              <FormLabel>Ordre</FormLabel>
              <FormControl>
                <Input type="number" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <FormMessage v-if="form.errors.value?.sections">
          {{ form.errors.value.sections }}
        </FormMessage>
      </CardContent>
    </Card>

    <!-- Prerequisites (optional) -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>Prérequis (optionnel)</CardTitle>
          <Button type="button" size="sm" @click="addPrerequisite">
            <IconPlus class="w-4 h-4 mr-2" />
            Ajouter un prérequis
          </Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-3">
        <div
          v-for="(prereq, index) in prerequisites"
          :key="index"
          class="flex items-start gap-2"
        >
          <FormField v-slot="{ componentField }" :name="`prerequisites.${index}.description`">
            <FormItem class="flex-1">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Description du prérequis"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="button" variant="destructive" size="sm" @click="removePrerequisite(index)">
            <IconTrash class="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Image & SEO -->
    <Card>
      <CardHeader>
        <CardTitle>Image et SEO</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <ImageUploadField
          variant="simple"
          label="Image du guide"
          description="Format: JPG, PNG, WEBP. Max: 2MB"
          :current-image-url="currentImageUrl"
          :image-to-delete="imageToDelete"
          @change="$emit('imageChange', $event)"
          @delete="$emit('deleteImage')"
        />

        <FormField v-slot="{ componentField }" name="metaDescription">
          <FormItem>
            <FormLabel>Meta Description (SEO)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Description pour les moteurs de recherche (max 160 caractères)"
                v-bind="componentField"
                rows="2"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <CheckboxGroup
          name="tagIds"
          label="Tags (optionnel)"
          :items="tags"
          :show-header="false"
          max-height="small"
          :show-empty-message="true"
          empty-message="Aucun tag disponible"
        />

        <CheckboxGroup
          name="seoKeywordIds"
          label="Mots-clés SEO (optionnel)"
          :items="seoKeywords"
          display-field="keyword"
          :show-header="false"
          max-height="small"
          :show-empty-message="true"
          empty-message="Aucun mot-clé disponible"
        />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Plus as IconPlus, Trash as IconTrash } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import CheckboxGroup from '@/components/shared/CheckboxGroup.vue'
import ImageUploadField from '@/components/shared/ImageUploadField.vue'

interface Game {
  id: number
  name: string
}

interface GuideType {
  id: number
  name: string
}

interface DifficultyLevel {
  id: number
  name: string
}

interface Tag {
  id: number
  name: string
}

interface SeoKeyword {
  id: number
  keyword: string
}

interface Section {
  title: string
  content: string
  order: number
  [key: string]: any  // Allow additional properties from API
}

interface Prerequisite {
  description: string
  [key: string]: any  // Allow additional properties from API
}

interface Props {
  form: ReturnType<typeof import('vee-validate').useForm>
  sections: Section[]
  prerequisites: Prerequisite[]
  games: Game[]
  guideTypes: GuideType[]
  difficultyLevels: DifficultyLevel[]
  tags: Tag[]
  seoKeywords: SeoKeyword[]
  currentImageUrl?: string
  imageToDelete?: boolean
  values: Record<string, unknown>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  imageChange: [event: Event]
  deleteImage: []
}>()

const addSection = () => {
  const newOrder = props.sections.length
  props.form.setFieldValue('sections', [
    ...props.sections,
    { title: '', content: '', order: newOrder },
  ])
}

const removeSection = (index: number) => {
  const updated = props.sections.filter((_, i) => i !== index)
  // Réorganiser les order
  updated.forEach((section, i) => {
    section.order = i
  })
  props.form.setFieldValue('sections', updated)
}

const addPrerequisite = () => {
  props.form.setFieldValue('prerequisites', [...props.prerequisites, { description: '' }])
}

const removePrerequisite = (index: number) => {
  props.form.setFieldValue(
    'prerequisites',
    props.prerequisites.filter((_, i) => i !== index)
  )
}
</script>
