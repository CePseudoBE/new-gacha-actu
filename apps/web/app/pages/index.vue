<template>
  <div>
    <HeroSection />
    <ArticlesSection />

    <!-- Section Vidéos YouTube -->
    <YouTubeCarousel
      :videos="youtubeVideos"
      title="Vidéos de la Communauté"
    />

    <!-- Section Réseaux Sociaux -->
    <section class="py-8 bg-muted/30">
      <div class="container mx-auto px-4">
        <div class="max-w-md mx-auto">
          <SocialSection
            twitter-username="votrecompte"
            discord-invite="https://discord.gg/animegachapulse"
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
import YouTubeCarousel from '@/components/home/YouTubeCarousel.vue'
import SocialSection from '@/components/social/SocialSection.vue'
import { useMockYouTubeVideos } from '@/composables/useMockData'

const { videos: youtubeVideos } = useMockYouTubeVideos()

// SEO Meta tags
useSeoMeta({
  title: 'Accueil',
  description: 'Découvrez les dernières actualités, guides experts et tier lists des meilleurs jeux Gacha : Genshin Impact, Honkai Star Rail, Fire Emblem Heroes et plus encore !',
  ogTitle: 'Anime Gacha Pulse - Toute l\'actualité des jeux Gacha',
  ogDescription: 'Derniers guides, tier lists et événements de l\'univers Gacha. Par des passionnés, pour les passionnés.',
  ogType: 'website',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Anime Gacha Pulse - Toute l\'actualité des jeux Gacha',
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
        name: 'Anime Gacha Pulse',
        url: 'https://animegachapulse.com',
        description: 'Anime Gacha Pulse est LE site d\'actualités pour les fans de jeux Gacha. Guides experts, tier lists, événements et dernières news.',
        inLanguage: 'fr-FR',
        publisher: {
          '@type': 'Organization',
          name: 'Anime Gacha Pulse',
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
