/**
 * Composable pour charger les données nécessaires aux formulaires d'articles
 * Réutilisable entre create et edit
 * Utilise lazy loading pour un meilleur SSR et UX
 */
export const useArticleFormData = () => {
  const api = useApi()

  // Fetch all necessary data with lazy loading and dedupe
  const { data: games, refresh: refreshGames } = useLazyAsyncData(
    'admin-form-games',
    async () => {
      const response = await api.api.games.$get()
      return response.data?.data || []
    },
    {
      dedupe: 'defer',
    }
  )

  const { data: categories, refresh: refreshCategories } = useLazyAsyncData(
    'admin-form-article-categories',
    async () => {
      const response = await api.api['article-categories'].$get()
      return response.data?.data || []
    },
    {
      dedupe: 'defer',
    }
  )

  const { data: tags, refresh: refreshTags } = useLazyAsyncData(
    'admin-form-tags',
    async () => {
      const response = await api.api.tags.$get()
      return response.data?.data || []
    },
    {
      dedupe: 'defer',
    }
  )

  const { data: seoKeywords, refresh: refreshSeoKeywords } = useLazyAsyncData(
    'admin-form-seo-keywords',
    async () => {
      const response = await api.api['seo-keywords'].$get()
      return response.data?.data || []
    },
    {
      dedupe: 'defer',
    }
  )

  return {
    games,
    categories,
    tags,
    seoKeywords,
    refreshGames,
    refreshCategories,
    refreshTags,
    refreshSeoKeywords,
  }
}
