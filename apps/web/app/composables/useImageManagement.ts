import { useApiErrorHandler } from './useApiErrorHandler'

/**
 * Composable pour gérer les images (upload, suppression)
 * Réutilisable pour Article, Guide, etc.
 */
export const useImageManagement = () => {
  const api = useApi()
  const config = useRuntimeConfig()
  const { handleApiCall } = useApiErrorHandler()

  const imageToDelete = ref(false)
  const deleteImageDialogOpen = ref(false)

  /**
   * Génère l'URL complète d'une image
   */
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return undefined
    // Si l'URL contient déjà le protocole, on la retourne telle quelle
    if (imagePath.startsWith('http')) return imagePath
    // Sinon on préfixe avec l'URL de l'API
    return `${config.public.apiUrl}${imagePath}`
  }

  /**
   * Ouvre le dialogue de confirmation de suppression
   */
  const handleDeleteImage = () => {
    deleteImageDialogOpen.value = true
  }

  /**
   * Supprime une image via l'API
   */
  const deleteImage = async (imageId: number, refreshCallback?: () => Promise<void>) => {
    await handleApiCall(
      () => api.api.admin.images({ id: imageId }).$delete(),
      {
        successMessage: 'Image supprimée avec succès',
        errorMessage: "Erreur lors de la suppression de l'image",
        onSuccess: async () => {
          imageToDelete.value = true
          await refreshCallback?.()
        },
      }
    )
  }

  return {
    imageToDelete,
    deleteImageDialogOpen,
    getImageUrl,
    handleDeleteImage,
    deleteImage,
  }
}
