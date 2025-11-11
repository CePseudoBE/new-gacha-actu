<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30 px-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <div class="flex items-center gap-2 mb-2">
          <UserPlus class="w-6 h-6" />
          <CardTitle class="text-2xl font-bold">Inscription</CardTitle>
        </div>
        <CardDescription>Créez un compte pour accéder à la plateforme</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Full Name Field -->
          <div class="space-y-2">
            <Label for="fullName">Nom complet</Label>
            <Input
              id="fullName"
              v-model="fullName"
              type="text"
              placeholder="John Doe"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Email Field -->
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="john@example.com"
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
            <p class="text-xs text-muted-foreground">Minimum 8 caractères</p>
          </div>

          <!-- Password Confirmation Field -->
          <div class="space-y-2">
            <Label for="password_confirmation">Confirmer le mot de passe</Label>
            <Input
              id="password_confirmation"
              v-model="passwordConfirmation"
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
            S'inscrire
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col gap-2 text-sm text-muted-foreground">
        <NuxtLink to="/admin/login" class="hover:text-primary transition-colors">
          Déjà un compte ? Se connecter →
        </NuxtLink>
        <NuxtLink to="/" class="hover:text-primary transition-colors">
          ← Retour au site
        </NuxtLink>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { UserPlus, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Pas de layout admin pour la page de register
definePageMeta({
  layout: false,
  middleware: 'guest', // Empêche l'accès si déjà connecté
})

const route = useRoute()
const { register } = useAuth()
const toast = useToast()

const fullName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    // Validation basique
    if (password.value !== passwordConfirmation.value) {
      errorMessage.value = 'Les mots de passe ne correspondent pas'
      return
    }

    if (password.value.length < 8) {
      errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères'
      return
    }

    // Appel via composable useAuth
    const result = await register({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })

    if (!result.success) {
      errorMessage.value = result.error || 'Échec de l\'inscription'
      return
    }

    // Succès
    toast.success('Inscription réussie ! Bienvenue.')

    // Rediriger vers la page demandée ou le dashboard admin
    const redirect = route.query.redirect as string
    navigateTo(redirect || '/admin')
  } catch (error: any) {
    console.error('Register error:', error)
    errorMessage.value = 'Une erreur est survenue lors de l\'inscription'
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Inscription - Gacha Pulse',
})
</script>
