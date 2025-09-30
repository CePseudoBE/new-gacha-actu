<template>
  <Card class="w-full">
    <CardHeader class="pb-6 text-center">
      <CardTitle class="flex items-center justify-center gap-2 text-xl">
        <IconUsers class="w-6 h-6 text-primary" />
        Suivez-nous
      </CardTitle>
      <p class="text-muted-foreground">
        {{ customMessage }}
      </p>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Twitter/X -->
      <NuxtLink
        :to="`https://twitter.com/${twitterUsername}`"
        target="_blank"
        rel="noopener noreferrer"
        class="block"
      >
        <Button
          variant="outline"
          class="w-full justify-start gap-3 h-12 hover:bg-blue-50 hover:border-blue-200 transition-colors"
        >
          <IconTwitter class="w-5 h-5 text-blue-500" />
          <div class="text-left flex-1">
            <div class="font-medium">Twitter / X</div>
            <div class="text-sm text-muted-foreground">@{{ twitterUsername }}</div>
          </div>
          <IconExternalLink class="w-4 h-4 text-muted-foreground" />
        </Button>
      </NuxtLink>

      <!-- Discord -->
      <NuxtLink
        v-if="discordInvite"
        :to="discordInvite"
        target="_blank"
        rel="noopener noreferrer"
        class="block"
      >
        <Button
          variant="outline"
          class="w-full justify-start gap-3 h-12 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
        >
          <div class="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
            <span class="text-white text-xs font-bold">D</span>
          </div>
          <div class="text-left flex-1">
            <div class="font-medium">Discord</div>
            <div class="text-sm text-muted-foreground">Rejoindre le serveur</div>
          </div>
          <IconExternalLink class="w-4 h-4 text-muted-foreground" />
        </Button>
      </NuxtLink>

      <!-- Newsletter/Notifications -->
      <div class="pt-2 border-t">
        <div class="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <IconBell class="w-4 h-4" />
          <span>Restez informé des dernières actualités</span>
        </div>
        <p class="text-xs text-muted-foreground">
          Suivez-nous sur nos réseaux pour ne manquer aucune news sur vos jeux Gacha préférés !
        </p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Users as IconUsers, ExternalLink as IconExternalLink, Bell as IconBell } from 'lucide-vue-next'
import IconTwitter from '@/components/icons/IconTwitter.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  twitterUsername?: string
  discordInvite?: string
  customMessage?: string
}

withDefaults(defineProps<Props>(), {
  twitterUsername: 'votrecompte',
  customMessage: 'Rejoignez notre communauté pour ne rien manquer !'
})
</script>
