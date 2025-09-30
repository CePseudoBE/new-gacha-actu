<template>
  <section v-if="videos.length" :class="cn('py-16 bg-background', className)">
    <div class="container mx-auto px-4">
      <!-- Header avec style distinct -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="bg-red-600 p-2 rounded-lg">
            <Youtube class="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              {{ title }}
            </h2>
            <p class="text-muted-foreground text-sm">
              Découvrez les dernières vidéos de la communauté
            </p>
          </div>
        </div>

        <!-- Navigation arrows -->
        <div class="hidden md:flex gap-2">
          <Button
            variant="outline"
            size="icon"
            :disabled="!canGoPrev"
            class="rounded-full"
            @click="goPrev"
          >
            <ChevronLeft class="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            :disabled="!canGoNext"
            class="rounded-full"
            @click="goNext"
          >
            <ChevronRight class="w-4 h-4" />
          </Button>
        </div>
      </div>

      <!-- Carousel container -->
      <div class="relative">
        <div class="overflow-hidden rounded-2xl">
          <div
            class="flex transition-transform duration-500 ease-out"
            :style="{
              transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`
            }"
          >
            <div
              v-for="video in videos"
              :key="video.id"
              :class="cn(
                'flex-shrink-0 px-2',
                visibleCount === 1 && 'w-full',
                visibleCount === 2 && 'w-1/2',
                visibleCount === 3 && 'w-1/3'
              )"
            >
              <div class="group">
                <YouTubeVideo
                  :video-id="video.videoId"
                  :title="video.title"
                  :thumbnail="video.thumbnail"
                  class="mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                />

                <!-- Metadata -->
                <div class="px-2">
                  <p v-if="video.channelTitle" class="text-xs text-red-600 font-medium mb-1">
                    {{ video.channelTitle }}
                  </p>
                  <h3 class="font-semibold text-sm text-foreground line-clamp-2 mb-2">
                    {{ video.title }}
                  </h3>
                  <p v-if="video.description" class="text-xs text-muted-foreground line-clamp-3 mb-3">
                    {{ video.description }}
                  </p>
                  <p v-if="video.publishedAt" class="text-xs text-muted-foreground">
                    {{ formatDate(video.publishedAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile navigation -->
        <div class="md:hidden flex justify-between items-center mt-6">
          <Button
            variant="outline"
            size="sm"
            :disabled="!canGoPrev"
            class="rounded-full"
            @click="goPrev"
          >
            <ChevronLeft class="w-4 h-4 mr-1" />
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="!canGoNext"
            class="rounded-full"
            @click="goNext"
          >
            Suivant
            <ChevronRight class="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <!-- Pagination dots -->
      <div class="flex justify-center gap-2 mt-6">
        <button
          v-for="(_, index) in Math.ceil(videos.length / visibleCount)"
          :key="index"
          :class="cn(
            'w-2 h-2 rounded-full transition-all duration-300',
            Math.floor(currentIndex / visibleCount) === index
              ? 'bg-red-600 w-6'
              : 'bg-muted hover:bg-muted-foreground/20'
          )"
          :aria-label="`Aller à la page ${index + 1}`"
          @click="goToSlide(index * visibleCount)"
        />
      </div>

      <!-- Voir plus -->
      <div class="text-center mt-8">
        <Button
          variant="outline"
          class="rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          as-child
        >
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <Youtube class="w-4 h-4 mr-2" />
            Voir plus sur YouTube
          </a>
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Youtube, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import YouTubeVideo from './YouTubeVideo.vue'
import { cn } from '@/lib/utils'

interface YouTubeVideoData {
  id: string
  videoId: string
  title: string
  description?: string
  publishedAt?: string
  channelTitle?: string
  thumbnail?: string
  category?: string
}

interface Props {
  videos: YouTubeVideoData[]
  title?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Vidéos Récentes',
  className: ''
})

const currentIndex = ref(0)
const visibleCount = ref(1)

const canGoNext = computed(() => currentIndex.value < props.videos.length - visibleCount.value)
const canGoPrev = computed(() => currentIndex.value > 0)

const updateVisibleCount = () => {
  if (process.client) {
    if (window.innerWidth >= 1280) { // xl
      visibleCount.value = 3
    } else if (window.innerWidth >= 768) { // md
      visibleCount.value = 2
    } else {
      visibleCount.value = 1
    }
  }
}

const goNext = () => {
  if (canGoNext.value) {
    currentIndex.value++
  }
}

const goPrev = () => {
  if (canGoPrev.value) {
    currentIndex.value--
  }
}

const goToSlide = (index: number) => {
  const maxIndex = Math.max(0, props.videos.length - visibleCount.value)
  currentIndex.value = Math.min(index, maxIndex)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(() => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
})

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('resize', updateVisibleCount)
  }
})
</script>
