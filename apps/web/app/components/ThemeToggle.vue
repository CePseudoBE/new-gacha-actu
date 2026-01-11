<template>
  <button
    type="button"
    class="inline-flex items-center justify-center rounded-full p-2 border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
    :aria-label="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
    @click="toggleColorMode"
  >
    <Sun v-if="isDark" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const { isDark, toggleColorMode } = useColorMode()
</script>
