<template>
  <footer class="bg-background border-t">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo et description -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <IconGamepad class="h-6 w-6 text-primary" />
            <span
              class="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              Gacha Pulse
            </span>
          </div>
          <p class="text-sm text-muted-foreground">
            Par un fan, pour les fans. Votre source d'actualités et de guides pour l'univers des
            jeux Gacha.
          </p>
          <div class="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Fait avec</span>
            <IconHeart class="h-4 w-4 text-red-500 fill-red-500" />
            <span>pour la communauté</span>
          </div>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="font-semibold mb-4">Navigation</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/" class="text-muted-foreground hover:text-foreground transition-colors">
                Accueil
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/news" class="text-muted-foreground hover:text-foreground transition-colors">
                Actualités
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/games" class="text-muted-foreground hover:text-foreground transition-colors">
                Jeux
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/guides" class="text-muted-foreground hover:text-foreground transition-colors">
                Guides
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/tier-lists" class="text-muted-foreground hover:text-foreground transition-colors">
                Tier Lists
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Jeux populaires -->
        <div>
          <h3 class="font-semibold mb-4">Jeux populaires</h3>
          <ul v-if="popularGames && popularGames.length > 0" class="space-y-2 text-sm">
            <li v-for="game in popularGames" :key="game.slug">
              <NuxtLink
                :to="`/games/${game.slug}`"
                class="text-muted-foreground hover:text-foreground transition-colors"
              >
                {{ game.name }}
              </NuxtLink>
            </li>
          </ul>
          <div v-else class="text-sm text-muted-foreground">
            Chargement des jeux...
          </div>
        </div>

        <!-- Partenaires & Communauté -->
        <div>
          <h3 class="font-semibold mb-4">Partenaires</h3>
          <div class="space-y-4">
            <NuxtLink
              to="https://leap.ldplayer.gg/T4DYBI9Ic"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <NuxtImg src="/icons/ldplayer.svg" alt="LDPlayer" width="20" height="20" />
              LDPlayer
            </NuxtLink>
            <NuxtLink
              to="https://fr.gamesplanet.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <NuxtImg src="/icons/gamesplanetsmall.png" alt="Gamesplanet" width="20" height="20" />
              Gamesplanet
            </NuxtLink>
          </div>

          <div class="mt-6">
            <h4 class="font-medium mb-3">Communauté</h4>
            <div class="flex items-center gap-3">
              <NuxtLink
                to="https://discord.gg/t2tFyNzVRv"
                target="_blank"
                rel="noopener noreferrer"
                class="text-muted-foreground hover:text-foreground transition-colors"
                title="Discord"
              >
                <IconDiscord class="h-5 w-5" />
              </NuxtLink>
              <NuxtLink
                to="https://x.com/BLEACH_SR_FR"
                target="_blank"
                rel="noopener noreferrer"
                class="text-muted-foreground hover:text-foreground transition-colors"
                title="Twitter"
              >
                <IconTwitter class="h-5 w-5" />
              </NuxtLink>
              <NuxtLink
                to="https://www.youtube.com/channel/UCcQUMlxwLGXLt911wYBk51g"
                target="_blank"
                rel="noopener noreferrer"
                class="text-muted-foreground hover:text-foreground transition-colors"
                title="YouTube"
              >
                <IconYoutube class="h-5 w-5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
        <p>© 2025 Gacha Pulse. Tous droits réservés. Fait avec passion pour la communauté Gacha.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Gamepad as IconGamepad, Heart as IconHeart, Youtube as IconYoutube } from 'lucide-vue-next'
import IconDiscord from '@/components/icons/IconDiscord.vue'
import IconTwitter from '@/components/icons/IconTwitter.vue'

interface Game {
  id: number
  name: string
  slug: string
}

const config = useRuntimeConfig()

// Fetch popular games from API (cached and deduplicated)
const { data: popularGames } = await useAsyncData(
  'footer-popular-games',
  async () => {
    try {
      const response = await $fetch<any>(`${config.public.apiUrl}/api/games/popular?limit=5`)
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch popular games for footer:', error)
      return []
    }
  },
  {
    // Garde en cache et déduplique les requêtes
    dedupe: 'defer',
    // Cache pendant 5 minutes
    getCachedData: (key) => {
      const data = useNuxtData(key)
      if (!data.data.value) return

      const expirationDate = new Date(data._fetchedAt || 0)
      expirationDate.setTime(expirationDate.getTime() + 5 * 60 * 1000) // 5 minutes
      const isExpired = expirationDate.getTime() < Date.now()

      if (isExpired) return
      return data.data.value
    }
  }
)
</script>
