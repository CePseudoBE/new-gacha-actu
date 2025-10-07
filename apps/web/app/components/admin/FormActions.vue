<template>
  <div class="flex gap-3">
    <Button type="submit" :disabled="isSubmitting">
      <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
      {{ submitLabel }}
    </Button>
    <Button type="button" variant="outline" @click="onCancel">
      Annuler
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

interface Props {
  submitLabel?: string
  isSubmitting?: boolean
  cancelUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  submitLabel: 'Enregistrer',
  isSubmitting: false,
  cancelUrl: '/admin',
})

const emit = defineEmits<{
  cancel: []
}>()

const onCancel = () => {
  if (props.cancelUrl) {
    navigateTo(props.cancelUrl)
  } else {
    emit('cancel')
  }
}
</script>
