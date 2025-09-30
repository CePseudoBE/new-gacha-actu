import type { Article, Game, YoutubeVideo } from '@/types/api'

export function useMockArticles() {
  const now = Date.now()

  const articles: Article[] = [
    {
      id: 1,
      title: 'Raiden Shogun Banner - Guide complet des meilleurs builds',
      summary: 'Découvrez les meilleurs builds pour Raiden Shogun et maximisez ses capacités au combat.',
      content: '# Guide Raiden Shogun\n\nContenu du guide...',
      author: 'Jean Dupont',
      publishedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      slug: 'raiden-shogun-banner-guide',
      imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=400&fit=crop',
      imageId: null,
      metaDescription: 'Guide complet pour optimiser Raiden Shogun dans Genshin Impact',
      readingTime: 8,
      categoryId: 1,
      isPopular: true,
      gameId: 1,
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      game: {
        id: 1,
        name: 'Genshin Impact',
        slug: 'genshin-impact',
        description: 'RPG open-world avec système gacha',
        releaseDate: '2020-09-28',
        isPopular: true,
        officialSite: 'https://genshin.hoyoverse.com',
        wiki: null,
        imageId: null,
        createdAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
      },
      category: {
        id: 1,
        name: 'Guide',
        slug: 'guide',
        description: 'Guides et tutoriels',
        createdAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
      },
      tags: [
        { id: 1, name: 'Raiden', slug: 'raiden', createdAt: new Date(now).toISOString(), updatedAt: new Date(now).toISOString() },
        { id: 2, name: 'Build', slug: 'build', createdAt: new Date(now).toISOString(), updatedAt: new Date(now).toISOString() },
      ],
    },
    {
      id: 2,
      title: 'Firefly arrive sur Honkai Star Rail - Analyse complète',
      summary: 'Firefly débarque avec des capacités uniques. Voici tout ce qu\'il faut savoir.',
      content: '# Analyse Firefly\n\nContenu de l\'analyse...',
      author: 'Marie Martin',
      publishedAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      slug: 'firefly-honkai-star-rail-analyse',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
      imageId: null,
      metaDescription: 'Analyse complète du nouveau personnage Firefly',
      readingTime: 6,
      categoryId: 2,
      isPopular: false,
      gameId: 2,
      createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      game: {
        id: 2,
        name: 'Honkai Star Rail',
        slug: 'honkai-star-rail',
        description: 'RPG au tour par tour spatial',
        releaseDate: '2023-04-26',
        isPopular: true,
        officialSite: 'https://hsr.hoyoverse.com',
        wiki: null,
        imageId: null,
        createdAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
      },
      category: {
        id: 2,
        name: 'News',
        slug: 'news',
        description: 'Actualités',
        createdAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
      },
      tags: [
        { id: 3, name: 'Firefly', slug: 'firefly', createdAt: new Date(now).toISOString(), updatedAt: new Date(now).toISOString() },
      ],
    },
    {
      id: 3,
      title: 'Événement Fallen Heroes - Fire Emblem Heroes',
      summary: 'Le nouvel événement Fallen Heroes apporte des héros légendaires.',
      content: '# Event Fallen Heroes\n\nDétails de l\'événement...',
      author: 'Pierre Dubois',
      publishedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      slug: 'fallen-heroes-fire-emblem',
      imageUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=400&fit=crop',
      imageId: null,
      metaDescription: 'Tout savoir sur l\'événement Fallen Heroes',
      readingTime: 5,
      categoryId: 3,
      isPopular: true,
      gameId: 3,
      createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      game: {
        id: 3,
        name: 'Fire Emblem Heroes',
        slug: 'fire-emblem-heroes',
        description: 'Stratégie tactique mobile',
        releaseDate: '2017-02-02',
        isPopular: true,
        officialSite: 'https://fire-emblem-heroes.com',
        wiki: null,
        imageId: null,
        createdAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
      },
      category: {
        id: 3,
        name: 'Événement',
        slug: 'evenement',
        description: 'Événements en jeu',
        createdAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
      },
    },
  ]

  return {
    articles,
    getPopularArticles: (limit = 6) => articles.filter(a => a.isPopular).slice(0, limit),
    getArticlesByGame: (gameSlug: string) => articles.filter(a => a.game?.slug === gameSlug),
    getArticleBySlug: (slug: string) => articles.find(a => a.slug === slug),
  }
}

export function useMockGames() {
  const now = Date.now()

  const games: Game[] = [
    {
      id: 1,
      name: 'Genshin Impact',
      slug: 'genshin-impact',
      description: 'RPG open-world avec système gacha développé par HoYoverse',
      releaseDate: '2020-09-28',
      isPopular: true,
      officialSite: 'https://genshin.hoyoverse.com',
      wiki: null,
      imageId: null,
      imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=400&fit=crop',
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    },
    {
      id: 2,
      name: 'Honkai Star Rail',
      slug: 'honkai-star-rail',
      description: 'RPG au tour par tour spatial par HoYoverse',
      releaseDate: '2023-04-26',
      isPopular: true,
      officialSite: 'https://hsr.hoyoverse.com',
      wiki: null,
      imageId: null,
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    },
    {
      id: 3,
      name: 'Fire Emblem Heroes',
      slug: 'fire-emblem-heroes',
      description: 'Stratégie tactique mobile par Nintendo',
      releaseDate: '2017-02-02',
      isPopular: true,
      officialSite: 'https://fire-emblem-heroes.com',
      wiki: null,
      imageId: null,
      imageUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=400&fit=crop',
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    },
  ]

  return {
    games,
    getPopularGames: () => games.filter(g => g.isPopular),
    getGameBySlug: (slug: string) => games.find(g => g.slug === slug),
  }
}

export function useMockYouTubeVideos() {
  const now = Date.now()

  const videos: YoutubeVideo[] = [
    {
      id: 1,
      videoId: 'dQw4w9WgXcQ',
      title: 'Bleach Soul Resonance - Guide complet débutant',
      description: 'Apprenez les bases du jeu et démarrez votre aventure avec ce guide complet.',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      publishedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      gameId: 1,
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    },
    {
      id: 2,
      videoId: 'jNQXAC9IVRw',
      title: 'Seven Deadly Sins Origins - Meilleurs builds PvP',
      description: 'Les compositions d\'équipe meta pour dominer en PvP.',
      thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
      publishedAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      gameId: 2,
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    },
    {
      id: 3,
      videoId: '9bZkp7q19f0',
      title: 'Genshin Impact - Banner Raiden Shogun reaction',
      description: 'Ma réaction en direct sur le nouveau banner Raiden Shogun !',
      thumbnailUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      publishedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      gameId: 1,
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    },
  ]

  return {
    videos,
    getRecentVideos: (limit = 6) => videos.slice(0, limit),
  }
}
