<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">{{ title }}</h1>
        <p class="text-muted-foreground">{{ description }}</p>
      </div>
      <Button variant="outline" @click="navigateTo(backUrl)">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Retour
      </Button>
    </div>

    <!-- Form Card -->
    <Card>
      <CardHeader>
        <CardTitle>{{ cardTitle }}</CardTitle>
      </CardHeader>
      <CardContent>
        <slot />
      </CardContent>
    </Card>

    <!-- Additional slots for dialogs -->
    <slot name="dialogs" />
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  title: string
  description: string
  cardTitle: string
  backUrl?: string
}

withDefaults(defineProps<Props>(), {
  backUrl: '/admin',
})
</script>
