/**
 * Composable pour générer des données structurées JSON-LD (Schema.org)
 * Améliore le SEO et l'affichage dans les résultats de recherche (rich snippets)
 */
export function useJsonLd() {
  /**
   * Génère le JSON-LD pour un article
   */
  const generateArticleJsonLd = (article: {
    title: string
    summary: string
    content: string
    author: string
    publishedAt: string
    updatedAt?: string
    image?: { url: string } | null
    slug: string
    game?: { name: string }
    tags?: Array<{ name: string }>
  }) => {
    const siteUrl = 'https://gachapulse.com'

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.summary,
      image: article.image?.url || `${siteUrl}/og-image.jpg`,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt || article.publishedAt,
      author: {
        '@type': 'Person',
        name: article.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'Gacha Pulse',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}/article/${article.slug}`
      },
      about: article.game ? {
        '@type': 'VideoGame',
        name: article.game.name
      } : undefined,
      keywords: article.tags?.map(tag => tag.name).join(', ')
    }
  }

  /**
   * Génère le JSON-LD pour une liste d'articles (ItemList)
   */
  const generateArticleListJsonLd = (articles: Array<{ title: string; slug: string; image?: { url: string } | null }>) => {
    const siteUrl = 'https://gachapulse.com'

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: articles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          headline: article.title,
          url: `${siteUrl}/article/${article.slug}`,
          image: article.image?.url
        }
      }))
    }
  }

  /**
   * Génère le JSON-LD pour le site web (WebSite + SearchAction)
   */
  const generateWebsiteJsonLd = () => {
    const siteUrl = 'https://gachapulse.com'

    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Gacha Pulse',
      url: siteUrl,
      description: 'L\'actualité des jeux Gacha par des passionnés',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }
  }

  /**
   * Injecte le JSON-LD dans le head de la page
   */
  const setJsonLd = (jsonLdData: object) => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(jsonLdData)
        }
      ]
    })
  }

  return {
    generateArticleJsonLd,
    generateArticleListJsonLd,
    generateWebsiteJsonLd,
    setJsonLd
  }
}
