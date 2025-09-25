export default class CacheService {
  // Cache keys constants
  static KEYS = {
    GAMES_ALL: 'games:all',
    GAMES_POPULAR: 'games:popular',
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
}
