/**
 * Composable pour accéder au client Tuyau typé
 * Fournit un accès centralisé à l'API backend avec type safety complet
 */
export const useApi = () => {
  const { $api } = useNuxtApp()
  return $api
}

/**
 * Gestion d'erreur centralisée pour les appels API
 * Extrait les messages d'erreur et les formate pour l'affichage
 */
export const handleApiError = (error: any) => {
  if (error?.response) {
    const status = error.response.status
    const data = error.response.data

    // Erreurs de validation (422)
    if (status === 422 && data?.errors) {
      const messages = Object.values(data.errors).flat().join(', ')
      return messages || 'Erreur de validation'
    }

    // Erreurs serveur (500+)
    if (status >= 500) {
      return 'Erreur serveur, veuillez réessayer plus tard'
    }

    // Erreurs client (4xx)
    if (status === 404) {
      return 'Ressource non trouvée'
    }

    if (status === 401) {
      return 'Non autorisé'
    }

    if (status === 403) {
      return 'Accès interdit'
    }

    // Message générique depuis l'API
    if (data?.message) {
      return data.message
    }
  }

  // Erreur réseau ou autre
  if (error?.message) {
    return error.message
  }

  return 'Une erreur est survenue'
}
