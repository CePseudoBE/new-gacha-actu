import cache from '@adonisjs/cache/services/main'

export default class CacheService {
  // Cache keys constants
  static KEYS = {
    GAMES_ALL: 'games:all',
    GAMES_POPULAR: 'games:popular',
    GAMES_POPULAR_WITH_LIMIT: (limit: number) => `games:popular:${limit}`,
    GAMES_BY_SLUG: (slug: string) => `games:slug:${slug}`,
    GENRES_ALL: 'genres:all',
    PLATFORMS_ALL: 'platforms:all',
    TAGS_ALL: 'tags:all',
    DIFFICULTY_LEVELS_ALL: 'difficulty_levels:all',
    GUIDE_TYPES_ALL: 'guide_types:all',
    SEO_KEYWORDS_ALL: 'seo_keywords:all',
    ARTICLE_CATEGORIES_ALL: 'article_categories:all',
    GUIDES_ALL: 'guides:all',
    GUIDES_POPULAR: 'guides:popular',
    GUIDES_BY_GAME: (gameId: number) => `guides:game:${gameId}`,
    ARTICLES_ALL: 'articles:all',
    ARTICLES_POPULAR: 'articles:popular',
    YOUTUBE_VIDEOS_ACTIVE: 'youtube_videos:active',
    MAINTENANCE_STATUS: 'maintenance:status',
  } as const

  // Cache TTL (Time To Live) constants in seconds
  static TTL = {
    EXTRA_SHORT: 10,
    SHORT: 5 * 60, // 5 minutes - for frequently changing data
    MEDIUM: 30 * 60, // 30 minutes - for moderately changing data
    LONG: 2 * 60 * 60, // 2 hours - for rarely changing data
    VERY_LONG: 24 * 60 * 60, // 24 hours - for very static data
  } as const

  /**
   * Invalide plusieurs clés de cache en parallèle
   */
  static async invalidateKeys(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => cache.delete({ key })))
  }

  /**
   * Invalide tous les caches liés aux jeux
   */
  static async invalidateGameCaches(gameSlug?: string): Promise<void> {
    const keys = [
      this.KEYS.GAMES_ALL,
      this.KEYS.GAMES_POPULAR,
      // Invalide les différentes limites populaires courantes
      this.KEYS.GAMES_POPULAR_WITH_LIMIT(5),
      this.KEYS.GAMES_POPULAR_WITH_LIMIT(10),
      this.KEYS.GAMES_POPULAR_WITH_LIMIT(20),
      this.KEYS.GAMES_POPULAR_WITH_LIMIT(50),
    ]

    if (gameSlug) {
      keys.push(this.KEYS.GAMES_BY_SLUG(gameSlug))
    }

    await this.invalidateKeys(keys)
  }

  /**
   * Invalide tous les caches liés aux guides
   */
  static async invalidateGuideCaches(gameId?: number): Promise<void> {
    const keys: string[] = [this.KEYS.GUIDES_ALL, this.KEYS.GUIDES_POPULAR]

    if (gameId) {
      keys.push(this.KEYS.GUIDES_BY_GAME(gameId))
    }

    await this.invalidateKeys(keys)
  }

  /**
   * Invalide tous les caches liés aux articles
   */
  static async invalidateArticleCaches(): Promise<void> {
    await this.invalidateKeys([this.KEYS.ARTICLES_ALL, this.KEYS.ARTICLES_POPULAR])
  }
}
