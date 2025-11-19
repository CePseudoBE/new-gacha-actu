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
    <CheckboxGroup
      name="genreIds"
      label="Genres *"
      description="Sélectionnez au moins un genre"
      :items="genres"
      :show-header="true"
      :show-quick-add="true"
      quick-add-label="Ajouter un genre"
      max-height="none"
      @quick-add="$emit('quickAdd', 'genre')"
    />

    <!-- Platforms -->
    <CheckboxGroup
      name="platformIds"
      label="Plateformes"
      description="Sélectionnez les plateformes disponibles"
      :items="platforms"
      :show-header="true"
      :show-quick-add="true"
      quick-add-label="Ajouter une plateforme"
      max-height="none"
      @quick-add="$emit('quickAdd', 'platform')"
    />

    <!-- Tags -->
    <CheckboxGroup
      name="tagIds"
      label="Tags"
      description="Ajoutez des tags pour améliorer le référencement"
      :items="tags"
      :show-header="true"
      :show-quick-add="true"
      quick-add-label="Ajouter un tag"
      max-height="none"
      @quick-add="$emit('quickAdd', 'tag')"
    />

    <!-- Image Upload -->
    <ImageUploadField
      variant="formfield"
      name="image"
      label="Image"
      description="Format: PNG, JPG, WEBP (max 2MB)"
      :current-image-url="currentImageUrl"
      :image-to-delete="imageToDelete"
      @change="$emit('imageChange', $event)"
      @delete="$emit('deleteImage')"
    />

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
import CheckboxGroup from '@/components/shared/CheckboxGroup.vue'
import ImageUploadField from '@/components/shared/ImageUploadField.vue'

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
