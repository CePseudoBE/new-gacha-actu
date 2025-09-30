export const navigationConfig = {
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
      children: [
        {
          id: 'genshin-impact',
          label: 'Genshin Impact',
          href: '/games/genshin-impact',
          description: 'RPG open-world avec système gacha'
        },
        {
          id: 'honkai-star-rail',
          label: 'Honkai Star Rail',
          href: '/games/honkai-star-rail',
          description: 'RPG au tour par tour spatial'
        },
        {
          id: 'fire-emblem-heroes',
          label: 'Fire Emblem Heroes',
          href: '/games/fire-emblem-heroes',
          description: 'Stratégie tactique mobile'
        },
        {
          id: 'bleach-soul-resonance',
          label: 'Bleach Soul Resonance',
          href: '/games/bleach-soul-resonance',
          description: 'Action RPG basé sur l\'anime Bleach'
        },
        {
          id: 'arknights',
          label: 'Arknights',
          href: '/games/arknights',
          description: 'Tower defense stratégique'
        }
      ],
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
