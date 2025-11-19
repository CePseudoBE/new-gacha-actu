<template>
  <div>
    <!-- Variant: FormField (Game/Article) -->
    <FormField v-if="variant === 'formfield'" v-slot="{ componentField }" :name="name">
      <FormItem>
        <FormLabel>{{ label }}</FormLabel>

        <!-- Current image preview -->
        <div v-if="currentImageUrl && !imageToDelete" class="mb-3 relative inline-block">
          <img :src="currentImageUrl" alt="Image actuelle" class="w-48 h-48 object-cover rounded-lg border" />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            class="absolute top-2 right-2"
            @click="$emit('delete')"
          >
            <X class="w-4 h-4" />
          </Button>
        </div>

        <!-- File input (hidden if image exists) -->
        <FormControl v-if="!currentImageUrl || imageToDelete">
          <Input
            type="file"
            accept="image/*"
            @change="$emit('change', $event)"
          />
        </FormControl>
        <FormDescription v-if="!currentImageUrl || imageToDelete">{{ description }}</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Variant: Simple (Guide) -->
    <div v-else-if="variant === 'simple'">
      <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{{ label }}</label>
      <div v-if="currentImageUrl" class="mt-2 mb-4">
        <img :src="currentImageUrl" alt="Image actuelle" class="w-48 h-48 object-cover rounded-lg" />
        <Button
          v-if="!imageToDelete"
          type="button"
          variant="destructive"
          size="sm"
          class="mt-2"
          @click="$emit('delete')"
        >
          Supprimer l'image
        </Button>
      </div>
      <Input
        type="file"
        accept="image/*"
        @change="$emit('change', $event)"
        :disabled="imageToDelete"
      />
      <p class="text-sm text-muted-foreground mt-1">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
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

interface Props {
  variant?: 'formfield' | 'simple'
  name?: string
  label?: string
  description?: string
  currentImageUrl?: string
  imageToDelete?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'formfield',
  name: 'image',
  label: 'Image',
  description: 'Format: PNG, JPG, WEBP (max 2MB)',
})

defineEmits<{
  (e: 'change', event: Event): void
  (e: 'delete'): void
}>()
</script>
