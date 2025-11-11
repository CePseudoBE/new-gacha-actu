<template>
  <div class="space-y-6">
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
    <FormField v-slot="{ value, handleChange }" name="genreIds">
      <FormItem>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <FormLabel>Genres *</FormLabel>
              <p class="text-sm text-muted-foreground">Sélectionnez au moins un genre</p>
            </div>
            <Button type="button" variant="outline" size="sm" @click="$emit('quickAdd', 'genre')">
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
                :model-value="!!(value && Array.isArray(value) && value.includes(genre.id))"
                @update:model-value="(checked) => {
                  const currentArray = Array.isArray(value) ? value : []
                  const newValue = checked
                    ? [...currentArray, genre.id]
                    : currentArray.filter(id => id !== genre.id)
                  handleChange(newValue)
                }"
              />
              <label
                :for="`genre-${genre.id}`"
                class="text-sm font-normal cursor-pointer leading-none"
              >
                {{ genre.name }}
              </label>
            </div>
          </div>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Platforms -->
    <FormField v-slot="{ value, handleChange }" name="platformIds">
      <FormItem>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <FormLabel>Plateformes</FormLabel>
              <p class="text-sm text-muted-foreground">Sélectionnez les plateformes disponibles</p>
            </div>
            <Button type="button" variant="outline" size="sm" @click="$emit('quickAdd', 'platform')">
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
                :model-value="!!(value && Array.isArray(value) && value.includes(platform.id))"
                @update:model-value="(checked) => {
                  const currentArray = Array.isArray(value) ? value : []
                  const newValue = checked
                    ? [...currentArray, platform.id]
                    : currentArray.filter(id => id !== platform.id)
                  handleChange(newValue)
                }"
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
              <p class="text-sm text-muted-foreground">Ajoutez des tags pour améliorer le référencement</p>
            </div>
            <Button type="button" variant="outline" size="sm" @click="$emit('quickAdd', 'tag')">
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
          <Switch
            :model-value="!!value"
            @update:model-value="handleChange"
          />
        </FormControl>
      </FormItem>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { Plus, X } from 'lucide-vue-next'
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

interface Props {
  genres: any[]
  platforms: any[]
  tags: any[]
  currentImageUrl?: string
  imageToDelete?: boolean
}

defineProps<Props>()

defineEmits<{
  (e: 'quickAdd', type: 'genre' | 'platform' | 'tag'): void
  (e: 'imageChange', event: Event): void
  (e: 'deleteImage'): void
}>()
</script>
