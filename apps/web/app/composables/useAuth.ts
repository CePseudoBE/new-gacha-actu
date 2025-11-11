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

      return {
        success: false,
        error: (response?.data?.message as string) || 'Échec de la connexion'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Une erreur est survenue lors de la connexion'
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

      return {
        success: false,
        error: (response?.data?.message as string) || 'Échec de l\'inscription'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Une erreur est survenue lors de l\'inscription'
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
    try {
      const response: any = await $api.api.auth['change-password'].$post({
        currentPassword,
        newPassword,
        newPassword_confirmation: newPasswordConfirmation,
      })

      if (response?.data?.success) {
        return { success: true }
      }

      return {
        success: false,
        error: (response?.data?.message as string) || 'Échec du changement de mot de passe'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Une erreur est survenue lors du changement de mot de passe'
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
