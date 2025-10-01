<template>
  <header
    v-if="navigationConfig"
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <Logo :text="navigationConfig.logo.text" :href="navigationConfig.logo.href" />

        <!-- Menu mobile -->
        <MobileNavigation
          :config="navigationConfig"
          :is-open="isMobileMenuOpen"
          @toggle="toggleMobileMenu"
        />

        <!-- Navigation centrée -->
        <DesktopNavigation :config="navigationConfig" />

        <!-- Réseaux sociaux -->
        <div class="hidden md:flex md:flex-1 md:justify-end">
          <SocialLinks :links="navigationConfig.socialLinks" variant="desktop" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { getNavigationConfig } from '@/config/navigation'
import Logo from './navigation/Logo.vue'
import DesktopNavigation from './navigation/DesktopNavigation.vue'
import MobileNavigation from './navigation/MobileNavigation.vue'
import SocialLinks from './navigation/SocialLinks.vue'

const isMobileMenuOpen = ref(false)

// Fetch navigation config with dynamic games (cached, deduplicated across pages)
const { data: navigationConfig } = await useAsyncData(
  'navigation-config',
  () => getNavigationConfig(),
  {
    // Garde en cache et déduplique les requêtes
    dedupe: 'defer',
  }
)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>
