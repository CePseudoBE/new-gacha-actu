import { toast } from 'vue-sonner'
import type { ValidationError, ApiError } from '@/types/models'

/**
 * Structure d'erreur API avec support Tuyau
 */
interface TuyauErrorResponse {
  error?: {
    value?: {
      message?: string
      errors?: ValidationError[]
    }
  }
  data?: {
    message?: string
    errors?: ValidationError[]
  }
  status?: number
  message?: string
}

/**
 * Options pour handleApiCall
 */
interface HandleApiCallOptions<T> {
  successMessage?: string
  errorMessage?: string
  onSuccess?: (data: T) => void | Promise<void>
  onError?: (error: ApiError) => void | Promise<void>
}

/**
 * Composable pour gérer les erreurs API de manière cohérente
 * Extrait les messages d'erreur et affiche des toasts appropriés
 */
export const useApiErrorHandler = () => {
  /**
   * Gère les erreurs de validation (422) et les erreurs génériques
   */
  const handleError = (error: TuyauErrorResponse | Error | unknown, defaultMessage = 'Une erreur est survenue'): void => {
    const errorResponse = error as TuyauErrorResponse
    const errorData = errorResponse?.error?.value || errorResponse?.data

    // Erreurs de validation (tableau d'erreurs)
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      errorData.errors.forEach((err: ValidationError) => {
        toast.error(err.message || 'Erreur de validation')
      })
      return
    }

    // Erreur simple avec message
    const message = errorData?.message || (error as Error)?.message || defaultMessage
    toast.error(message)
  }

  /**
   * Vérifie si une réponse API est une erreur
   */
  const isError = (response: TuyauErrorResponse): boolean => {
    return Boolean(response?.error || (response?.status && response.status >= 400))
  }

  /**
   * Wrapper pour gérer les appels API avec gestion d'erreur automatique
   *
   * @example
   * ```typescript
   * const { handleApiCall } = useApiErrorHandler()
   * await handleApiCall(
   *   () => api.api.admin.games({ id: 1 }).$delete(),
   *   {
   *     successMessage: 'Jeu supprimé',
   *     onSuccess: async () => await refresh()
   *   }
   * )
   * ```
   */
  const handleApiCall = async <T>(
    apiCall: () => Promise<T>,
    options?: HandleApiCallOptions<T>
  ): Promise<T | null> => {
    try {
      const response = await apiCall()

      if (isError(response as TuyauErrorResponse)) {
        handleError(response, options?.errorMessage)
        if (options?.onError) {
          const apiError: ApiError = {
            message: (response as TuyauErrorResponse)?.error?.value?.message || options?.errorMessage || 'Une erreur est survenue',
            errors: (response as TuyauErrorResponse)?.error?.value?.errors,
            statusCode: (response as TuyauErrorResponse)?.status
          }
          await options.onError(apiError)
        }
        return null
      }

      if (options?.successMessage) {
        toast.success(options.successMessage)
      }

      await options?.onSuccess?.(response)
      return response
    } catch (error) {
      handleError(error, options?.errorMessage)
      if (options?.onError) {
        const apiError: ApiError = {
          message: (error as Error)?.message || options?.errorMessage || 'Une erreur est survenue'
        }
        await options.onError(apiError)
      }
      return null
    }
  }

  return {
    handleError,
    isError,
    handleApiCall,
  }
}
