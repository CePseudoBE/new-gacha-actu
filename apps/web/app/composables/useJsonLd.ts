export function useWebsiteJsonLd() {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Anime Gacha Pulse',
          url: 'https://animegachapulse.com',
          description: 'Anime Gacha Pulse est LE site d\'actualités pour les fans de jeux Gacha. Guides experts, tier lists, événements et dernières news.',
          inLanguage: 'fr-FR',
          publisher: {
            '@type': 'Organization',
            name: 'Anime Gacha Pulse',
            logo: {
              '@type': 'ImageObject',
              url: 'https://animegachapulse.com/logo.png'
            }
          }
        })
      }
    ]
  })
}

export function useArticleJsonLd(article: {
  title: string
  description: string
  imageUrl: string | null
  publishedAt: string
  author: string
  url: string
}) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.description,
          image: article.imageUrl || 'https://animegachapulse.com/og-image.jpg',
          datePublished: article.publishedAt,
          author: {
            '@type': 'Person',
            name: article.author
          },
          publisher: {
            '@type': 'Organization',
            name: 'Anime Gacha Pulse',
            logo: {
              '@type': 'ImageObject',
              url: 'https://animegachapulse.com/logo.png'
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': article.url
          }
        })
      }
    ]
  })
}

export function useBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        })
      }
    ]
  })
}
