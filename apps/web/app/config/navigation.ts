interface Game {
  id: number
  name: string
  slug: string
  description: string
}

export const getNavigationConfig = async () => {
  const config = useRuntimeConfig()

  // Fetch popular games from API (limit to 3 for navigation)
  let games: Game[] = []
  try {
    const response = await $fetch<any>(`${config.public.apiUrl}/api/games/popular?limit=3`)
    games = response.data || []
  } catch (error) {
    console.error('Failed to fetch popular games for navigation:', error)
  }

  return {
    logo: {
      text: 'Anime Gacha Pulse',
      href: '/'
    },
    items: [
      {
        id: 'news',
        label: 'Actualités',
        href: '/news'
      },
      {
        id: 'games',
        label: 'Jeux',
        href: '/games',
        children: games.map(game => ({
          id: game.slug,
          label: game.name,
          href: `/games/${game.slug}`,
          description: game.description
        })),
        featured: {
          label: 'Tous les jeux',
          href: '/games',
          description: 'Découvrez tous les jeux Gacha'
        }
      },
      {
        id: 'guides',
        label: 'Guides',
        href: '/guides'
      },
      {
        id: 'tier-lists',
        label: 'Tier Lists',
        href: '/tier-lists'
      }
    ],
    socialLinks: [
      {
        id: 'discord',
        name: 'Discord',
        href: 'https://discord.gg/animegachapulse',
        ariaLabel: 'Rejoignez notre Discord'
      },
      {
        id: 'twitter',
        name: 'Twitter',
        href: '#',
        ariaLabel: 'Suivez-nous sur Twitter'
      },
      {
        id: 'youtube',
        name: 'YouTube',
        href: '#',
        ariaLabel: 'Abonnez-vous à notre chaîne YouTube'
      }
    ]
  }
}
