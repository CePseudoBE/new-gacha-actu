import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // Utiliser l'URL interne si disponible (Docker), sinon l'URL publique
  const apiUrl = process.env.API_INTERNAL_URL || config.public.apiUrl

  const urls: any[] = []
  const errors: string[] = []

  console.log('[SITEMAP] API URL:', apiUrl)

  // Pages statiques
  urls.push(
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/news', changefreq: 'daily', priority: 0.9 },
    { loc: '/games', changefreq: 'weekly', priority: 0.9 },
    { loc: '/guides', changefreq: 'daily', priority: 0.9 },
    { loc: '/tier-lists', changefreq: 'weekly', priority: 0.8 },
    { loc: '/upcoming', changefreq: 'daily', priority: 0.7 }
  )

  try {
    // Récupérer les jeux (limité à 100 par page max)
    const gamesRes = await $fetch<any>(`${apiUrl}/api/games?perPage=100`)
    const games = gamesRes?.data || []

    games.forEach((game: any) => {
      urls.push({
        loc: `/games/${game.slug}`,
        lastmod: game.updatedAt,
        changefreq: 'weekly',
        priority: 0.8
      })
    })

    // Récupérer les guides
    const guidesRes = await $fetch<any>(`${apiUrl}/api/guides?perPage=100`)
    const guides = guidesRes?.data || []

    guides.forEach((guide: any) => {
      urls.push({
        loc: `/guides/${guide.slug}`,
        lastmod: guide.updatedAt,
        changefreq: 'monthly',
        priority: 0.7
      })
    })

    // Récupérer les articles
    const articlesRes = await $fetch<any>(`${apiUrl}/api/articles?perPage=100`)
    const articles = articlesRes?.data || []

    articles.forEach((article: any) => {
      urls.push({
        loc: `/article/${article.slug}`,
        lastmod: article.updatedAt,
        changefreq: 'monthly',
        priority: 0.6
      })
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[SITEMAP] Error fetching sitemap URLs:', errorMessage)
    console.error('[SITEMAP] Full error:', error)
    errors.push(`API Error: ${errorMessage}`)
    // En cas d'erreur, retourner au moins les pages statiques
  }

  // Pour debug : retourner aussi les erreurs
  return {
    urls,
    debug: {
      apiUrl,
      urlCount: urls.length,
      errors: errors.length > 0 ? errors : undefined
    }
  }
})
