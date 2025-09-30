<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Header -->
    <div class="mb-12 text-center">
      <div class="flex items-center justify-center gap-3 mb-4">
        <IconTrophy class="w-10 h-10 text-primary" />
        <h1 class="text-4xl md:text-5xl font-bold">Tier Lists</h1>
      </div>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
        Découvrez les classements des meilleurs personnages et armes pour dominer la méta
      </p>
    </div>

    <!-- Coming soon -->
    <div class="max-w-3xl mx-auto">
      <Card class="border-2 border-dashed">
        <CardContent class="py-16 text-center">
          <div class="mb-6">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <IconAward class="w-10 h-10 text-primary" />
            </div>
          </div>
          <h2 class="text-2xl font-bold mb-3">Tier Lists en cours</h2>
          <p class="text-muted-foreground mb-6 max-w-md mx-auto">
            Nos experts analysent la méta pour vous proposer des tier lists complètes et à jour :
          </p>

          <div class="grid md:grid-cols-2 gap-4 mt-8 text-left">
            <div class="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <IconStar class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 class="font-semibold mb-1">Personnages</h3>
                <p class="text-sm text-muted-foreground">Classement par rôle et utilité</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <IconSwords class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 class="font-semibold mb-1">Armes & Équipement</h3>
                <p class="text-sm text-muted-foreground">Meilleurs choix d'équipement</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <IconZap class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 class="font-semibold mb-1">PvP & PvE</h3>
                <p class="text-sm text-muted-foreground">Classements spécialisés</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <IconTrendingUp class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 class="font-semibold mb-1">Méta Actuelle</h3>
                <p class="text-sm text-muted-foreground">Mises à jour régulières</p>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-8 border-t">
            <p class="text-sm text-muted-foreground mb-4">En attendant les tier lists :</p>
            <div class="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" as-child>
                <NuxtLink to="/news">Actualités</NuxtLink>
              </Button>
              <Button variant="outline" as-child>
                <NuxtLink to="/guides">Guides</NuxtLink>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trophy as IconTrophy, Award as IconAward, Star as IconStar, Swords as IconSwords, Zap as IconZap, TrendingUp as IconTrendingUp } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

useHead({
  title: 'Tier Lists - Anime Gacha Pulse'
})
</script>
