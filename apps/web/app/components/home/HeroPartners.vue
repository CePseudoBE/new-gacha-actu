<template>
  <div class="mt-6 flex flex-col gap-4">
    <!-- Featured Partner - Pleine largeur -->
    <div v-if="featuredPartner">
      <!-- Mobile -->
      <NuxtLink
        :to="featuredPartner.href"
        target="_blank"
        rel="noopener noreferrer"
        class="lg:hidden inline-block opacity-70 hover:opacity-100 transition-opacity duration-300"
      >
        <img
          :src="featuredPartner.logo.mobile"
          :alt="featuredPartner.alt"
          :width="featuredPartner.dimensions.mobile.width"
          :height="featuredPartner.dimensions.mobile.height"
          loading="lazy"
        />
      </NuxtLink>
      <!-- Desktop -->
      <NuxtLink
        :to="featuredPartner.href"
        target="_blank"
        rel="noopener noreferrer"
        class="hidden lg:inline-block hover:scale-105 transition-transform duration-300"
      >
        <img
          :src="featuredPartner.logo.desktop"
          :alt="featuredPartner.alt"
          :width="featuredPartner.dimensions.desktop.width"
          :height="featuredPartner.dimensions.desktop.height"
          loading="lazy"
        />
      </NuxtLink>
    </div>

    <!-- Other Partners - Côte à côte -->
    <div>
      <!-- Mobile - Icônes côte à côte -->
      <div class="lg:hidden flex gap-4 items-center">
        <NuxtLink
          v-for="partner in partners"
          :key="partner.id"
          :to="partner.href"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block opacity-70 hover:opacity-100 transition-opacity duration-300"
        >
          <img
            :src="partner.logo.mobile"
            :alt="partner.alt"
            :width="partner.dimensions.mobile.width"
            :height="partner.dimensions.mobile.height"
            loading="lazy"
          />
        </NuxtLink>
      </div>

      <!-- Desktop - Logos côte à côte -->
      <div class="hidden lg:flex gap-6 items-center">
        <NuxtLink
          v-for="partner in partners"
          :key="partner.id"
          :to="partner.href"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block hover:scale-105 transition-transform duration-300"
        >
          <img
            :src="partner.logo.desktop"
            :alt="partner.alt"
            :width="partner.dimensions.desktop.width"
            :height="partner.dimensions.desktop.height"
            loading="lazy"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Partner {
  id: string
  name: string
  href: string
  logo: {
    desktop: string
    mobile: string
  }
  alt: string
  dimensions: {
    desktop: { width: number; height: number }
    mobile: { width: number; height: number }
  }
}

interface Props {
  featuredPartner?: Partner
  partners: Partner[]
}

defineProps<Props>()
</script>
