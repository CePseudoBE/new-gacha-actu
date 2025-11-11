import { defineEventHandler } from 'h3'
import type { SitemapUrlInput } from '#sitemap/types'

export default defineEventHandler(async (event): Promise<SitemapUrlInput[]> => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl

  const urls: SitemapUrlInput[] = []

  // Pages statiques
  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/news', changefreq: 'daily', priority: 0.9 },
    { loc: '/games', changefreq: 'weekly', priority: 0.9 },
    { loc: '/guides', changefreq: 'daily', priority: 0.9 },
    { loc: '/tier-lists', changefreq: 'weekly', priority: 0.8 },
    { loc: '/upcoming', changefreq: 'daily', priority: 0.7 }
  ]

  urls.push(...staticPages)

  try {
    // Récupérer tous les jeux
    const gamesResponse = await $fetch<any>(`${apiUrl}/api/games?perPage=1000`)
    const games = gamesResponse?.data?.data || []

    games.forEach((game: any) => {
      urls.push({
        loc: `/games/${game.slug}`,
        lastmod: game.updatedAt,
        changefreq: 'weekly',
        priority: 0.8
      })
    })

    // Récupérer tous les guides
    const guidesResponse = await $fetch<any>(`${apiUrl}/api/guides?perPage=1000`)
    const guides = guidesResponse?.data?.data || []

    guides.forEach((guide: any) => {
      urls.push({
        loc: `/guides/${guide.slug}`,
        lastmod: guide.updatedAt,
        changefreq: 'monthly',
        priority: 0.7
      })
    })

    // Récupérer tous les articles
    const articlesResponse = await $fetch<any>(`${apiUrl}/api/articles?perPage=1000`)
    const articles = articlesResponse?.data?.data || []

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
  }

  return urls
})
