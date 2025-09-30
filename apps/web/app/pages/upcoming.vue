<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Header -->
    <div class="mb-12 text-center">
      <div class="flex items-center justify-center gap-3 mb-4">
        <IconCalendar class="w-10 h-10 text-primary" />
        <h1 class="text-4xl md:text-5xl font-bold">À venir</h1>
      </div>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
        Découvrez les prochains événements, bannières et mises à jour des jeux Gacha les plus populaires
      </p>
    </div>

    <!-- Coming soon placeholder -->
    <div class="max-w-3xl mx-auto">
      <Card class="border-2 border-dashed">
        <CardContent class="py-16 text-center">
          <div class="mb-6">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <IconClock class="w-10 h-10 text-primary" />
            </div>
          </div>
          <h2 class="text-2xl font-bold mb-3">Calendrier en cours de préparation</h2>
          <p class="text-muted-foreground mb-6 max-w-md mx-auto">
            Nous travaillons activement sur le calendrier des événements à venir. Cette section sera bientôt disponible avec :
          </p>

          <div class="grid md:grid-cols-3 gap-4 mt-8 text-left">
            <div class="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <IconSparkles class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 class="font-semibold mb-1">Bannières à venir</h3>
                <p class="text-sm text-muted-foreground">Nouveaux personnages et armes</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <IconGamepad class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 class="font-semibold mb-1">Événements in-game</h3>
                <p class="text-sm text-muted-foreground">Raids, quêtes et récompenses</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <IconBell class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 class="font-semibold mb-1">Mises à jour</h3>
                <p class="text-sm text-muted-foreground">Patches et nouveautés</p>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-8 border-t">
            <p class="text-sm text-muted-foreground mb-4">En attendant, explorez notre contenu :</p>
            <div class="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" as-child>
                <NuxtLink to="/news">
                  <IconNewspaper class="w-4 h-4 mr-2" />
                  Actualités
                </NuxtLink>
              </Button>
              <Button variant="outline" as-child>
                <NuxtLink to="/guides">
                  <IconBook class="w-4 h-4 mr-2" />
                  Guides
                </NuxtLink>
              </Button>
              <Button variant="outline" as-child>
                <NuxtLink to="/tier-lists">
                  <IconTrophy class="w-4 h-4 mr-2" />
                  Tier Lists
                </NuxtLink>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar as IconCalendar, Clock as IconClock, Sparkles as IconSparkles, Gamepad2 as IconGamepad, Bell as IconBell, Newspaper as IconNewspaper, Book as IconBook, Trophy as IconTrophy } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

useHead({
  title: 'À venir - Anime Gacha Pulse'
})
</script>
