/**
 * Composable pour charger les données nécessaires aux formulaires de guides
 * (games, difficulty levels, guide types, tags, seo keywords)
 */
export const useGuideFormData = () => {
  const api = useApi()

  // Load games
  const { data: games, refresh: refreshGames } = useAsyncData('games-for-guide-form', async () => {
    const { data: apiData } = await api.api.games.$get()
    return apiData?.data || []
  })

  // Load difficulty levels
  const {
    data: difficultyLevels,
    refresh: refreshDifficultyLevels,
  } = useAsyncData('difficulty-levels', async () => {
    const { data: apiData } = await api.api['difficulty-levels'].$get()
    return apiData?.data || []
  })

  // Load guide types
  const { data: guideTypes, refresh: refreshGuideTypes } = useAsyncData(
    'guide-types',
    async () => {
      const { data: apiData } = await api.api['guide-types'].$get()
      return apiData?.data || []
    }
  )

  // Load tags
  const { data: tags, refresh: refreshTags } = useAsyncData('tags-for-guide-form', async () => {
    const { data: apiData } = await api.api.tags.$get()
    return apiData?.data || []
  })

  // Load seo keywords
  const {
    data: seoKeywords,
    refresh: refreshSeoKeywords,
  } = useAsyncData('seo-keywords-for-guide-form', async () => {
    const { data: apiData } = await api.api['seo-keywords'].$get()
    return apiData?.data || []
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
