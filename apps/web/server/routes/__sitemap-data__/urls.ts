import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // Utiliser l'URL interne si disponible (Docker), sinon l'URL publique
  const apiUrl = process.env.API_INTERNAL_URL || config.public.apiUrl

  const urls: any[] = []

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
    // Récupérer les jeux
    const gamesRes = await $fetch<any>(`${apiUrl}/api/games?perPage=1000`)
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
    const guidesRes = await $fetch<any>(`${apiUrl}/api/guides?perPage=1000`)
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
    const articlesRes = await $fetch<any>(`${apiUrl}/api/articles?perPage=1000`)
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
    console.error('Error fetching sitemap URLs:', error)
    // En cas d'erreur, retourner au moins les pages statiques
  }

  return urls
})
