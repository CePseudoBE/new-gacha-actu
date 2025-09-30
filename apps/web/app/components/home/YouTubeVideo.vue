<template>
  <div :class="cn('relative aspect-video overflow-hidden rounded-lg bg-muted', className)">
    <!-- Iframe YouTube -->
    <iframe
      v-if="isLoaded"
      :src="iframeUrl"
      :title="title"
      class="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />

    <!-- Thumbnail avec bouton play -->
    <button
      v-else
      class="group block w-full h-full"
      @click="loadVideo"
    >
      <!-- Thumbnail -->
      <div class="relative w-full h-full">
        <img
          v-if="thumbnailUrl"
          :src="thumbnailUrl"
          :alt="title"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div v-else class="w-full h-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
          <Youtube class="w-12 h-12 text-white/50" />
        </div>

        <!-- Overlay hover -->
        <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

        <!-- Play button -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Play class="w-6 h-6 text-white ml-1" fill="currentColor" />
          </div>
        </div>

        <!-- Duration badge (optionnel) -->
        <div v-if="duration" class="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-medium">
          {{ duration }}
        </div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Youtube, Play } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  videoId: string
  title: string
  thumbnail?: string
  duration?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  thumbnail: '',
  duration: '',
  className: ''
})

const isLoaded = ref(false)

const thumbnailUrl = computed(() =>
  props.thumbnail || `https://img.youtube.com/vi/${props.videoId}/maxresdefault.jpg`
)

const iframeUrl = computed(() => {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1'
  })
  return `https://www.youtube-nocookie.com/embed/${props.videoId}?${params.toString()}`
})

const loadVideo = () => {
  isLoaded.value = true
}
</script>
