<template>
  <Card>
    <CardHeader>
      <CardTitle>Mode Maintenance</CardTitle>
      <p class="text-sm text-muted-foreground">
        Gérez le mode maintenance du site
      </p>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- Status Indicator -->
      <div
        class="flex items-center justify-between p-4 rounded-lg border"
        :class="
          maintenanceEnabledServer
            ? 'bg-destructive/10 border-destructive/20'
            : 'bg-green-500/10 border-green-500/20'
        "
      >
        <div class="flex items-center gap-3">
          <div
            class="w-3 h-3 rounded-full"
            :class="maintenanceEnabledServer ? 'bg-destructive animate-pulse' : 'bg-green-500'"
          />
          <div>
            <p class="font-medium">
              {{ maintenanceEnabledServer ? 'Maintenance activée' : 'Site en ligne' }}
            </p>
            <p class="text-sm text-muted-foreground">
              {{
                maintenanceEnabledServer
                  ? 'Les visiteurs voient la page de maintenance'
                  : 'Le site est accessible normalement'
              }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <!-- Toggle Switch -->
        <div class="flex items-center justify-between">
          <Label for="maintenance-toggle" class="text-base font-medium cursor-pointer">
            Activer le mode maintenance
          </Label>
          <Switch id="maintenance-toggle" v-model="maintenanceEnabled" />
        </div>

        <!-- Message Editor -->
        <div class="space-y-2">
          <Label for="maintenance-message">Message personnalisé (optionnel)</Label>
          <Textarea
            id="maintenance-message"
            v-model="maintenanceMessage"
            placeholder="Notre équipe travaille actuellement sur des améliorations du site. Nous serons bientôt de retour avec de nouvelles fonctionnalités !"
            rows="3"
          />
          <p class="text-xs text-muted-foreground">Laissez vide pour utiliser le message par défaut</p>
        </div>

        <!-- Estimated End Time -->
        <div class="space-y-2">
          <Label for="estimated-end-time">Durée estimée (optionnel)</Label>
          <Input id="estimated-end-time" type="datetime-local" v-model="estimatedEndTime" />
          <p class="text-xs text-muted-foreground">Heure de fin prévue de la maintenance</p>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end">
          <Button @click="save" :disabled="isUpdating"> Enregistrer les modifications </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const {
  maintenanceEnabledServer,
  maintenanceEnabled,
  maintenanceMessage,
  estimatedEndTime,
  isUpdating,
  loadStatus,
  save,
} = useMaintenance()

onMounted(() => {
  loadStatus()
})
</script>
