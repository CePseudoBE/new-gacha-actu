/**
 * Composable pour préparer les valeurs initiales d'un article pour le formulaire
 * Convertit les données de l'API vers le format attendu par le formulaire
 */
export const useArticleInitialValues = (article: any) => {
  return {
    title: article?.title || '',
    summary: article?.summary || '',
    author: article?.author || '',
    publishedAt: article?.publishedAt
      ? new Date(article.publishedAt).toISOString().slice(0, 16)
      : '',
    content: article?.content || '',
    metaDescription: article?.metaDescription || '',
    readingTime: article?.readingTime || undefined,
    categoryId: article?.category?.id || undefined,
    isPopular: article?.isPopular || false,
    gameId: article?.game?.id || undefined,
    tagIds: article?.tags?.map((t: any) => t.id) || [],
    seoKeywordIds: article?.seoKeywords?.map((k: any) => k.id) || [],
  }
}
