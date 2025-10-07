/**
 * Composable pour gérer les dialogues Quick Add
 * Réutilisable pour différents types d'entités
 */
export const useQuickAdd = (refreshCallbacks: {
  refreshCategories?: () => void
  refreshTags?: () => void
  refreshSeoKeywords?: () => void
}) => {
  const quickAddDialogOpen = ref(false)
  const quickAddType = ref<'tag' | 'seo-keyword' | 'category'>('tag')

  const openQuickAdd = (type: 'tag' | 'seo-keyword' | 'category') => {
    quickAddType.value = type
    quickAddDialogOpen.value = true
  }

  const handleQuickAddSuccess = () => {
    switch (quickAddType.value) {
      case 'tag':
        refreshCallbacks.refreshTags?.()
        break
      case 'seo-keyword':
        refreshCallbacks.refreshSeoKeywords?.()
        break
      case 'category':
        refreshCallbacks.refreshCategories?.()
        break
    }
  }

  return {
    quickAddDialogOpen,
    quickAddType,
    openQuickAdd,
    handleQuickAddSuccess,
  }
}
