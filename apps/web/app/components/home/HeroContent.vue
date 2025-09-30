<template>
  <div class="flex-1 text-foreground">
    <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
      {{ title }}
    </h1>
    <p class="text-xl md:text-xl font-bold max-w-lg leading-relaxed text-muted-foreground mb-8">
      {{ subtitle }}
    </p>

    <!-- Buttons -->
    <div class="flex gap-4">
      <Button
        v-for="button in buttons"
        :key="button.id"
        :variant="button.variant"
        size="lg"
        as-child
      >
        <NuxtLink :to="button.href">
          {{ button.label }}
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

interface HeroButton {
  id: string
  label: string
  href: string
  variant: 'outline' | 'default' | 'ghost'
}

interface Props {
  title: string
  subtitle: string
  buttons: HeroButton[]
}

defineProps<Props>()
</script>
