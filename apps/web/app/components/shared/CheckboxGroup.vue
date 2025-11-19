<template>
  <FormField v-slot="{ value, handleChange }" :name="name">
    <FormItem>
      <div class="space-y-3">
        <!-- Header - 2 styles possibles -->
        <div v-if="showHeader" class="flex items-center justify-between">
          <div>
            <FormLabel>{{ label }}</FormLabel>
            <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
          </div>
          <Button
            v-if="showQuickAdd"
            type="button"
            variant="outline"
            size="sm"
            @click="$emit('quickAdd')"
          >
            <Plus class="w-4 h-4 mr-2" />
            {{ quickAddLabel }}
          </Button>
        </div>

        <!-- Simple label (Guide style) -->
        <FormLabel v-else>{{ label }}</FormLabel>

        <!-- Checkbox grid -->
        <div
          class="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg"
          :class="maxHeightClass"
        >
          <div
            v-for="item in items"
            :key="item.id"
            class="flex items-center space-x-2"
          >
            <Checkbox
              :id="`${name}-${item.id}`"
              :model-value="!!(value && Array.isArray(value) && value.includes(item.id))"
              @update:model-value="(checked) => {
                const currentArray = Array.isArray(value) ? value : []
                const newValue = checked
                  ? [...currentArray, item.id]
                  : currentArray.filter(id => id !== item.id)
                handleChange(newValue)
              }"
            />
            <label
              :for="`${name}-${item.id}`"
              class="text-sm font-normal cursor-pointer leading-none"
            >
              {{ item[displayField] }}
            </label>
          </div>
        </div>

        <!-- Empty message (Guide style) -->
        <p v-if="showEmptyMessage && (!items || items.length === 0)" class="text-sm text-muted-foreground">
          {{ emptyMessage }}
        </p>
      </div>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface Props {
  name: string
  label: string
  items: any[]
  description?: string
  showHeader?: boolean
  showQuickAdd?: boolean
  quickAddLabel?: string
  maxHeight?: 'none' | 'small' | 'medium'
  showEmptyMessage?: boolean
  emptyMessage?: string
  displayField?: string
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showQuickAdd: false,
  quickAddLabel: 'Ajouter',
  maxHeight: 'none',
  showEmptyMessage: false,
  emptyMessage: 'Aucun élément disponible',
  displayField: 'name',
})

defineEmits<{
  (e: 'quickAdd'): void
}>()

const maxHeightClass = computed(() => {
  switch (props.maxHeight) {
    case 'small':
      return 'max-h-48 overflow-y-auto'
    case 'medium':
      return 'max-h-64 overflow-y-auto'
    default:
      return ''
  }
})
</script>
