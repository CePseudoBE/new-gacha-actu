<template>
  <div class="min-h-screen bg-muted/30">
    <!-- Admin Header -->
    <header class="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div class="flex h-16 items-center px-6">
        <div class="flex items-center gap-8 flex-1">
          <!-- Logo/Title -->
          <NuxtLink to="/admin" class="flex items-center gap-2 font-semibold text-lg">
            <LayoutDashboard class="w-5 h-5" />
            <span>Admin</span>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="hidden md:flex gap-1">
            <Button variant="ghost" size="sm" as-child>
              <NuxtLink to="/admin" exact-active-class="bg-accent">
                Dashboard
              </NuxtLink>
            </Button>
            <Button variant="ghost" size="sm" as-child>
              <NuxtLink to="/admin/games" active-class="bg-accent">
                Jeux
              </NuxtLink>
            </Button>
            <Button variant="ghost" size="sm" as-child>
              <NuxtLink to="/admin/articles" active-class="bg-accent">
                Articles
              </NuxtLink>
            </Button>
            <Button variant="ghost" size="sm" as-child>
              <NuxtLink to="/admin/guides" active-class="bg-accent">
                Guides
              </NuxtLink>
            </Button>
          </nav>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center gap-3">
          <Button variant="outline" size="sm" as-child>
            <NuxtLink to="/">
              <ArrowLeft class="w-4 h-4 mr-2" />
              Retour au site
            </NuxtLink>
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto py-8 px-6 max-w-7xl">
      <slot />
    </main>

    <!-- Toast Notifications -->
    <ClientOnly>
      <Toaster position="bottom-left" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard, ArrowLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
</script>
