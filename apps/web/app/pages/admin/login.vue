<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30 px-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <div class="flex items-center gap-2 mb-2">
          <LayoutDashboard class="w-6 h-6" />
          <CardTitle class="text-2xl font-bold">Admin Login</CardTitle>
        </div>
        <CardDescription>Connectez-vous pour accéder au back-office</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Field -->
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="admin@example.com"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <Label for="password">Mot de passe</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <Button type="submit" class="w-full" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            Se connecter
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col gap-2 text-sm text-muted-foreground">
        <NuxtLink to="/" class="hover:text-primary transition-colors">
          ← Retour au site
        </NuxtLink>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Pas de layout admin pour la page de login
definePageMeta({
  layout: false,
  middleware: 'guest', // Empêche l'accès si déjà connecté
})

const route = useRoute()
const { login } = useAuth()
const toast = useToast()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    // Appel via composable useAuth
    const result = await login({
      email: email.value,
      password: password.value,
    })

    if (!result.success) {
      errorMessage.value = result.error || 'Identifiants incorrects'
      return
    }

    // Succès
    toast.success('Connexion réussie')

    // Rediriger vers la page demandée ou le dashboard admin
    const redirect = route.query.redirect as string
    navigateTo(redirect || '/admin')
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = 'Une erreur est survenue lors de la connexion'
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Admin Login - Gacha Pulse',
})
</script>
