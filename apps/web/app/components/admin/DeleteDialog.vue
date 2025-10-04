<template>
  <Dialog v-model:open="isOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="cancel">
          Annuler
        </Button>
        <Button variant="destructive" :disabled="isDeleting" @click="confirmDelete">
          <Loader2 v-if="isDeleting" class="w-4 h-4 mr-2 animate-spin" />
          {{ confirmText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  open?: boolean
  title?: string
  description?: string
  confirmText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmer la suppression',
  description: 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
  confirmText: 'Supprimer',
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void | Promise<void>
}>()

const isDeleting = ref(false)

const isOpen = computed({
  get: () => props.open || false,
  set: (value) => emit('update:open', value),
})

const cancel = () => {
  isOpen.value = false
}

const confirmDelete = async () => {
  isDeleting.value = true
  try {
    await emit('confirm')
    isOpen.value = false
  } finally {
    isDeleting.value = false
  }
}
</script>
