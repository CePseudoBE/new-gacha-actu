<template>
  <section
    class="relative min-h-[80vh] bg-gradient-to-br from-background to-card overflow-hidden"
  >
    <!-- Background images for mobile - subtle overlay -->
    <div class="absolute inset-0 lg:hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40 z-10" />
      <div class="flex h-full">
        <div v-for="(image, index) in heroConfig.images.mobile" :key="image.id" class="flex-1 relative">
          <NuxtImg
            :src="image.src"
            :alt="image.alt"
            class="absolute inset-0 w-full h-full object-cover object-center opacity-30"
            sizes="50vw"
            loading="eager"
          />
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 h-full relative z-20">
      <div class="flex items-center justify-between h-full min-h-[80vh] gap-12">
        <!-- Left side - Title and text -->
        <div class="flex-1">
          <HeroContent
            :title="heroConfig.title"
            :subtitle="heroConfig.subtitle"
            :buttons="heroConfig.buttons"
          />

          <!-- Partenaires -->
          <HeroPartners :featured-partner="heroConfig.featuredPartner" :partners="heroConfig.partners" />
        </div>

        <!-- Desktop images -->
        <HeroImages :images="heroConfig.images.desktop" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { heroConfig } from '@/config/hero'
import HeroContent from './HeroContent.vue'
import HeroPartners from './HeroPartners.vue'
import HeroImages from './HeroImages.vue'
</script>
