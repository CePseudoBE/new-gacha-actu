/**
 * Composable pour charger les données nécessaires aux formulaires de guides
 * (games, difficulty levels, guide types, tags, seo keywords)
 */
export const useGuideFormData = () => {
  const api = useApi()

  // Load games
  const { data: games, refresh: refreshGames } = useAsyncData('games-for-guide-form', async () => {
    const response = await api.api.games.$get()
    return response.data?.data || []
  })

  // Load difficulty levels
  const {
    data: difficultyLevels,
    refresh: refreshDifficultyLevels,
  } = useAsyncData('difficulty-levels', async () => {
    const response = await api.api['difficulty-levels'].$get()
    return response.data?.data || []
  })

  // Load guide types
  const { data: guideTypes, refresh: refreshGuideTypes } = useAsyncData(
    'guide-types',
    async () => {
      const response = await api.api['guide-types'].$get()
      return response.data?.data || []
    }
  )

  // Load tags
  const { data: tags, refresh: refreshTags } = useAsyncData('tags-for-guide-form', async () => {
    const response = await api.api.tags.$get()
    return response.data?.data || []
  })

  // Load seo keywords
  const {
    data: seoKeywords,
    refresh: refreshSeoKeywords,
  } = useAsyncData('seo-keywords-for-guide-form', async () => {
    const response = await api.api['seo-keywords'].$get()
    return response.data?.data || []
  })

  return {
    games,
    difficultyLevels,
    guideTypes,
    tags,
    seoKeywords,
    refreshGames,
    refreshDifficultyLevels,
    refreshGuideTypes,
    refreshTags,
    refreshSeoKeywords,
  }
}
