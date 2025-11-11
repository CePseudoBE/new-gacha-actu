<template>
  <div>
    <HeroSection />
    <ArticlesSection v-if="articles" :articles="articles" />

    <!-- Section Vidéos YouTube -->
    <YouTubeCarousel
      v-if="youtubeVideos && youtubeVideos.length > 0"
      :videos="youtubeVideos"
      title="Vidéos de la Communauté"
    />

    <!-- Section Réseaux Sociaux -->
    <section class="py-8 bg-muted/30">
      <div class="container mx-auto px-4">
        <div class="max-w-md mx-auto">
          <SocialSection
            twitter-username="BLEACH_SR_FR"
            discord-invite="https://discord.gg/t2tFyNzVRv"
            custom-message="Rejoignez notre communauté de passionnés de jeux Gacha !"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue'
import ArticlesSection from '@/components/home/ArticlesSection.vue'
// Lazy load composants below the fold pour améliorer LCP
const YouTubeCarousel = defineAsyncComponent(() => import('@/components/home/YouTubeCarousel.vue'))
const SocialSection = defineAsyncComponent(() => import('@/components/social/SocialSection.vue'))

const config = useRuntimeConfig()

// Fetch popular articles from API
const { data: articles = [] } = await useAsyncData(
  'popular-articles',
  () => $fetch(`${config.public.apiUrl}/api/articles/popular`)
    .then((res: any) => res.data || [])
)

// Fetch active YouTube videos from API
const { data: youtubeVideos = [] } = await useAsyncData(
  'active-youtube-videos',
  () => $fetch(`${config.public.apiUrl}/api/youtube-videos/active?limit=10`)
    .then((res: any) => res.data || [])
)

// SEO Meta tags
useSeoMeta({
  title: 'Accueil',
  description: 'Découvrez les dernières actualités, guides experts et tier lists des meilleurs jeux Gacha : Genshin Impact, Honkai Star Rail, Fire Emblem Heroes et plus encore !',
  ogTitle: 'Gacha Pulse - Toute l\'actualité des jeux Gacha',
  ogDescription: 'Derniers guides, tier lists et événements de l\'univers Gacha. Par des passionnés, pour les passionnés.',
  ogType: 'website',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Gacha Pulse - Toute l\'actualité des jeux Gacha',
  twitterDescription: 'Derniers guides, tier lists et événements de l\'univers Gacha'
})

// Structured data JSON-LD
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Gacha Pulse',
        url: 'https://animegachapulse.com',
        description: 'Gacha Pulse est LE site d\'actualités pour les fans de jeux Gacha. Guides experts, tier lists, événements et dernières news.',
        inLanguage: 'fr-FR',
        publisher: {
          '@type': 'Organization',
          name: 'Gacha Pulse',
          logo: {
            '@type': 'ImageObject',
            url: 'https://animegachapulse.com/logo.png'
          }
        }
      })
    }
  ]
})
</script>
