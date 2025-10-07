import { toast } from 'vue-sonner'

/**
 * Composable pour gérer les erreurs API de manière cohérente
 * Extrait les messages d'erreur et affiche des toasts appropriés
 */
export const useApiErrorHandler = () => {
  /**
   * Gère les erreurs de validation (422) et les erreurs génériques
   */
  const handleError = (error: any, defaultMessage = 'Une erreur est survenue') => {
    const errorData = error?.error?.value || error?.data

    // Erreurs de validation (tableau d'erreurs)
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      errorData.errors.forEach((err: any) => {
        toast.error(err.message || 'Erreur de validation')
      })
      return
    }

    // Erreur simple avec message
    const message = errorData?.message || error?.message || defaultMessage
    toast.error(message)
  }

  /**
   * Vérifie si une réponse API est une erreur
   */
  const isError = (response: any): boolean => {
    return response?.error || response?.status >= 400
  }

  /**
   * Wrapper pour gérer les appels API avec gestion d'erreur automatique
   */
  const handleApiCall = async <T>(
    apiCall: () => Promise<T>,
    options?: {
      successMessage?: string
      errorMessage?: string
      onSuccess?: (data: T) => void | Promise<void>
      onError?: (error: any) => void | Promise<void>
    }
  ): Promise<T | null> => {
    try {
      const response = await apiCall()

      if (isError(response)) {
        handleError(response, options?.errorMessage)
        await options?.onError?.(response)
        return null
      }

      if (options?.successMessage) {
        toast.success(options.successMessage)
      }

      await options?.onSuccess?.(response)
      return response
    } catch (error) {
      handleError(error, options?.errorMessage)
      await options?.onError?.(error)
      return null
    }
  }

  return {
    handleError,
    isError,
    handleApiCall,
  }
}
