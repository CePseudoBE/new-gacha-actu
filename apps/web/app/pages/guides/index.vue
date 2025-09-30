<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Header -->
    <div class="mb-12 text-center">
      <div class="flex items-center justify-center gap-3 mb-4">
        <IconBook class="w-10 h-10 text-primary" />
        <h1 class="text-4xl md:text-5xl font-bold">Guides</h1>
      </div>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
        Des guides complets pour maîtriser vos jeux Gacha préférés et progresser efficacement
      </p>
    </div>

    <!-- Coming soon -->
    <div class="max-w-3xl mx-auto">
      <Card class="border-2 border-dashed">
        <CardContent class="py-16 text-center">
          <div class="mb-6">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <IconBookOpen class="w-10 h-10 text-primary" />
            </div>
          </div>
          <h2 class="text-2xl font-bold mb-3">Guides en préparation</h2>
          <p class="text-muted-foreground mb-6 max-w-md mx-auto">
            Notre équipe rédige des guides détaillés pour vous aider à exceller. Prochainement disponibles :
          </p>

          <div class="grid md:grid-cols-2 gap-4 mt-8 text-left">
            <div class="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <IconSword class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 class="font-semibold mb-1">Builds de personnages</h3>
                <p class="text-sm text-muted-foreground">Équipements, artefacts et talents optimaux</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <IconUsers class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 class="font-semibold mb-1">Compositions d'équipe</h3>
                <p class="text-sm text-muted-foreground">Synergies et stratégies gagnantes</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <IconMap class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 class="font-semibold mb-1">Progression</h3>
                <p class="text-sm text-muted-foreground">Parcours débutant à expert</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <IconTarget class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 class="font-semibold mb-1">Contenu end-game</h3>
                <p class="text-sm text-muted-foreground">Raids, abyss et challenges</p>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-8 border-t">
            <p class="text-sm text-muted-foreground mb-4">Découvrez nos autres contenus :</p>
            <div class="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" as-child>
                <NuxtLink to="/news">Actualités</NuxtLink>
              </Button>
              <Button variant="outline" as-child>
                <NuxtLink to="/tier-lists">Tier Lists</NuxtLink>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Book as IconBook, BookOpen as IconBookOpen, Sword as IconSword, Users as IconUsers, Map as IconMap, Target as IconTarget } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

useHead({
  title: 'Guides - Anime Gacha Pulse'
})
</script>
