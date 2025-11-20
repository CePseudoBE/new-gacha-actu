import type { User } from '~/types/models'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  fullName: string
  email: string
  password: string
  password_confirmation: string
}

export const useAuth = () => {
  const { $api } = useNuxtApp()
  const user = useState<User | null>('auth:user', () => null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role?.slug === 'admin')
  const isEditor = computed(() => user.value?.role?.slug === 'editor')
  const canManageContent = computed(() => isAdmin.value || isEditor.value)

  /**
   * Récupère l'utilisateur actuellement connecté
   */
  const fetchUser = async (): Promise<User | null> => {
    try {
      const response: any = await $api.api.auth.me.$get()
      
      // Tuyau enveloppe la réponse: { data: { success, data }, error, response, status }
      if (response?.data?.success && response?.data?.data) {
        user.value = response.data.data as User
        return response.data.data as User
      }
      
      user.value = null
      return null
    } catch (error) {
      user.value = null
      return null
    }
  }

  /**
   * Connexion de l'utilisateur
   */
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const response: any = await $api.api.auth.login.$post(credentials)

      // Tuyau enveloppe: response.data contient la vraie réponse API
      if (response?.data?.success && response?.data?.data) {
        user.value = response.data.data as User
        return { success: true }
      }

      // Extraire le message d'erreur (l'API utilise 'error' pour les messages simples)
      const errorMessage =
        response?.data?.error ||
        response?.data?.message ||
        'Échec de la connexion'

      return {
        success: false,
        error: errorMessage
      }
    } catch (error: any) {
      // Extraire l'erreur depuis différentes sources Tuyau
      const errorData = error?.error?.value || error?.data
      const errorMessage =
        errorData?.error ||
        errorData?.message ||
        error?.message ||
        'Une erreur est survenue lors de la connexion'

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response: any = await $api.api.auth.register.$post(data)

      if (response?.data?.success && response?.data?.data) {
        user.value = response.data.data as User
        return { success: true }
      }

      const errorMessage =
        response?.data?.error ||
        response?.data?.message ||
        'Échec de l\'inscription'

      return {
        success: false,
        error: errorMessage
      }
    } catch (error: any) {
      const errorData = error?.error?.value || error?.data
      const errorMessage =
        errorData?.error ||
        errorData?.message ||
        error?.message ||
        'Une erreur est survenue lors de l\'inscription'

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Déconnexion de l'utilisateur
   */
  const logout = async (): Promise<void> => {
    try {
      await $api.api.auth.logout.$post()
    } catch (error) {
      // Silent error
    } finally {
      user.value = null
    }
  }

  /**
   * Changement de mot de passe
   */
  const changePassword = async (currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<{ success: boolean; error?: string }> => {
    // Vérification côté frontend
    if (newPassword !== newPasswordConfirmation) {
      return {
        success: false,
        error: 'Les mots de passe ne correspondent pas'
      }
    }

    try {
      const response: any = await $api.api.auth['change-password'].$post({
        currentPassword,
        newPassword,
      })

      if (response?.data?.success) {
        return { success: true }
      }

      const errorMessage =
        response?.data?.error ||
        response?.data?.message ||
        'Échec du changement de mot de passe'

      return {
        success: false,
        error: errorMessage
      }
    } catch (error: any) {
      const errorData = error?.error?.value || error?.data
      const errorMessage =
        errorData?.error ||
        errorData?.message ||
        error?.message ||
        'Une erreur est survenue lors du changement de mot de passe'

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  const hasRole = (roleSlug: string): boolean => {
    return user.value?.role?.slug === roleSlug
  }

  /**
   * Vérifie si l'utilisateur a l'un des rôles spécifiés
   */
  const hasAnyRole = (roleSlugs: string[]): boolean => {
    return user.value?.role?.slug ? roleSlugs.includes(user.value.role.slug) : false
  }

  return {
    // State
    user: readonly(user),
    isAuthenticated,
    isAdmin,
    isEditor,
    canManageContent,

    // Methods
    fetchUser,
    login,
    register,
    logout,
    changePassword,
    hasRole,
    hasAnyRole,
  }
}
