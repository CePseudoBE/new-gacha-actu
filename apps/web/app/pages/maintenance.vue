<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
    <div class="max-w-2xl w-full text-center space-y-8">
      <!-- Animated Icon -->
      <div class="relative">
        <div class="absolute inset-0 blur-3xl opacity-30 bg-primary rounded-full animate-pulse" />
        <div class="relative">
          <IconWrench class="w-32 h-32 mx-auto text-primary animate-bounce" />
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-4">
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight">
          Maintenance en cours
        </h1>
        <p class="text-xl md:text-2xl text-muted-foreground">
          Nous améliorons votre expérience
        </p>
      </div>

      <!-- Message -->
      <Card class="border-2 backdrop-blur-sm bg-card/50">
        <CardContent class="pt-6">
          <p class="text-lg text-muted-foreground leading-relaxed">
            {{ maintenanceMessage || "Notre équipe travaille actuellement sur des améliorations du site. Nous serons bientôt de retour avec de nouvelles fonctionnalités !" }}
          </p>
        </CardContent>
      </Card>

      <!-- Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <Card class="backdrop-blur-sm bg-card/50">
          <CardContent class="pt-6">
            <IconClock class="w-8 h-8 mx-auto mb-3 text-primary" />
            <p class="font-semibold mb-1">Durée estimée</p>
            <p class="text-sm text-muted-foreground">Quelques heures</p>
          </CardContent>
        </Card>

        <Card class="backdrop-blur-sm bg-card/50">
          <CardContent class="pt-6">
            <IconShield class="w-8 h-8 mx-auto mb-3 text-primary" />
            <p class="font-semibold mb-1">Vos données</p>
            <p class="text-sm text-muted-foreground">100% sécurisées</p>
          </CardContent>
        </Card>

        <Card class="backdrop-blur-sm bg-card/50">
          <CardContent class="pt-6">
            <IconRefreshCw class="w-8 h-8 mx-auto mb-3 text-primary" />
            <p class="font-semibold mb-1">Retour prévu</p>
            <p class="text-sm text-muted-foreground">Très bientôt</p>
          </CardContent>
        </Card>
      </div>

      <!-- Social Links -->
      <div class="flex items-center justify-center gap-4 pt-4">
        <p class="text-sm text-muted-foreground">Suivez-nous :</p>
        <div class="flex gap-3">
          <Button variant="outline" size="icon" class="rounded-full">
            <IconTwitter class="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" class="rounded-full">
            <IconMessageCircle class="w-4 h-4" />
          </Button>
        </div>
      </div>

      <!-- Refresh Button -->
      <div>
        <Button
          size="lg"
          variant="outline"
          @click="checkStatus"
          :disabled="isChecking"
          class="group"
        >
          <IconRefreshCw
            class="w-4 h-4 mr-2 transition-transform"
            :class="{ 'animate-spin': isChecking }"
          />
          Vérifier le statut
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Wrench as IconWrench,
  Clock as IconClock,
  Shield as IconShield,
  RefreshCw as IconRefreshCw,
  Twitter as IconTwitter,
  MessageCircle as IconMessageCircle,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

definePageMeta({
  layout: false,
})

const api = useApi()
const isChecking = ref(false)
const maintenanceMessage = ref<string>()

// Load maintenance message
const loadMaintenanceMessage = async () => {
  try {
    const { data } = await api.api.maintenance.status.$get()
    if (data?.data?.message) {
      maintenanceMessage.value = data.data.message
    }
  } catch (error) {
    console.error('Error loading maintenance message:', error)
  }
}

// Check if maintenance is still active
const checkStatus = async () => {
  isChecking.value = true
  try {
    const { data } = await api.api.maintenance.status.$get()
    if (!data?.data?.isEnabled) {
      // Maintenance terminée, redirection
      window.location.href = '/'
    }
  } catch (error) {
    console.error('Error checking status:', error)
  } finally {
    setTimeout(() => {
      isChecking.value = false
    }, 1000)
  }
}

let autoCheckInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  loadMaintenanceMessage()
  // Auto-check every 30 seconds
  autoCheckInterval = setInterval(checkStatus, 30000)
})

onUnmounted(() => {
  if (autoCheckInterval) {
    clearInterval(autoCheckInterval)
  }
})

useHead({
  title: 'Maintenance en cours - Gacha Pulse',
})
</script>
