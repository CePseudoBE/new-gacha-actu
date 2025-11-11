<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p class="text-muted-foreground mt-2">Bienvenue dans le back-office</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium">Articles</CardTitle>
            <IconFileText class="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">124</div>
            <p class="text-xs text-muted-foreground">+12 ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium">Jeux</CardTitle>
            <IconGamepad class="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">18</div>
            <p class="text-xs text-muted-foreground">+3 ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium">Guides</CardTitle>
            <IconBook class="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">42</div>
            <p class="text-xs text-muted-foreground">+5 ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium">Vidéos</CardTitle>
            <IconVideo class="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">89</div>
            <p class="text-xs text-muted-foreground">+8 cette semaine</p>
          </CardContent>
        </Card>
      </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Actions rapides</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card class="group hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo('/admin/articles')">
          <CardHeader>
            <div class="flex items-center gap-3">
              <div class="p-3 rounded-lg bg-primary/10">
                <IconFileText class="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Gérer les Articles</CardTitle>
                <p class="text-sm text-muted-foreground">Créer, éditer, supprimer</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button class="w-full" variant="outline">
              Accéder
              <IconArrowRight class="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card class="group hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo('/admin/games')">
          <CardHeader>
            <div class="flex items-center gap-3">
              <div class="p-3 rounded-lg bg-primary/10">
                <IconGamepad class="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Gérer les Jeux</CardTitle>
                <p class="text-sm text-muted-foreground">Ajouter, modifier les jeux</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button class="w-full" variant="outline">
              Accéder
              <IconArrowRight class="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card class="group hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo('/admin/guides')">
          <CardHeader>
            <div class="flex items-center gap-3">
              <div class="p-3 rounded-lg bg-primary/10">
                <IconBook class="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Gérer les Guides</CardTitle>
                <p class="text-sm text-muted-foreground">Créer des guides détaillés</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button class="w-full" variant="outline">
              Accéder
              <IconArrowRight class="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card class="group hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo('/admin/videos')">
          <CardHeader>
            <div class="flex items-center gap-3">
              <div class="p-3 rounded-lg bg-primary/10">
                <IconVideo class="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Gérer les Vidéos</CardTitle>
                <p class="text-sm text-muted-foreground">Ajouter des vidéos YouTube</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button class="w-full" variant="outline">
              Accéder
              <IconArrowRight class="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card class="group hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo('/admin/settings')">
          <CardHeader>
            <div class="flex items-center gap-3">
              <div class="p-3 rounded-lg bg-primary/10">
                <IconSettings class="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Paramètres</CardTitle>
                <p class="text-sm text-muted-foreground">Tags, catégories, SEO...</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button class="w-full" variant="outline">
              Accéder
              <IconArrowRight class="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Maintenance Mode -->
    <MaintenanceSettings />
  </div>
</template>

<script setup lang="ts">
import {
  FileText as IconFileText,
  Gamepad2 as IconGamepad,
  Book as IconBook,
  Video as IconVideo,
  Settings as IconSettings,
  ArrowRight as IconArrowRight,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({
  title: 'Admin Dashboard - Gacha Pulse',
})
</script>
