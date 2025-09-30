<template>
  <div class="hidden lg:flex gap-6 items-center">
    <div v-for="(image, index) in images" :key="index" class="relative">
      <div
        class="w-56 h-[28rem] rounded-2xl shadow-2xl transform rotate-0 hover:scale-105 transition-transform duration-300 overflow-hidden relative"
      >
        <NuxtImg
          :src="image.src"
          :alt="image.alt"
          class="absolute inset-0 w-full h-full object-cover rounded-2xl"
          loading="eager"
          sizes="224px"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface HeroImage {
  id: string
  src: string
  alt: string
}

interface Props {
  images: HeroImage[]
}

defineProps<Props>()
</script>
