<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="max-w-md w-full text-center space-y-6">
      <!-- Icon d'erreur -->
      <div class="flex justify-center">
        <div class="p-4 bg-destructive/10 rounded-full">
          <IconAlertCircle class="w-16 h-16 text-destructive" />
        </div>
      </div>

      <!-- Code d'erreur -->
      <div>
        <h1 class="text-6xl font-bold text-foreground mb-2">
          {{ error?.statusCode || '500' }}
        </h1>
        <h2 class="text-2xl font-semibold text-foreground mb-4">
          {{ getErrorTitle(error?.statusCode) }}
        </h2>
        <p class="text-muted-foreground">
          {{ error?.message || error?.statusMessage || 'Une erreur inattendue est survenue' }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button @click="handleError" variant="default">
          <IconHome class="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>
        <Button @click="reload" variant="outline">
          <IconRefreshCw class="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>

      <!-- Aide supplémentaire -->
      <div v-if="error?.statusCode === 404" class="text-sm text-muted-foreground">
        <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AlertCircle as IconAlertCircle,
  Home as IconHome,
  RefreshCw as IconRefreshCw
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
    stack?: string
  }
}

const props = defineProps<ErrorProps>()

const getErrorTitle = (statusCode?: number): string => {
  const titles: Record<number, string> = {
    404: 'Page introuvable',
    500: 'Erreur serveur',
    403: 'Accès refusé',
    401: 'Non autorisé',
  }
  return titles[statusCode || 500] || 'Erreur'
}

const handleError = () => {
  clearError({ redirect: '/' })
}

const reload = () => {
  clearError()
}

useHead({
  title: `Erreur ${props.error?.statusCode || '500'}`
})
</script>
