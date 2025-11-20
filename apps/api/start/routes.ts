/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Health check endpoint
const HealthChecksController = () => import('#controllers/health_checks_controller')
router.get('/health', [HealthChecksController])

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/
const GamesController = () => import('#controllers/games_controller')
const YoutubeVideosController = () => import('#controllers/youtube_videos_controller')
const GenresController = () => import('#controllers/genres_controller')
const PlatformsController = () => import('#controllers/platforms_controller')
const TagsController = () => import('#controllers/tags_controller')
const DifficultyLevelsController = () => import('#controllers/difficulty_levels_controller')
const SeoKeywordsController = () => import('#controllers/seo_keywords_controller')
const GuideTypesController = () => import('#controllers/guide_types_controller')
const GuidesController = () => import('#controllers/guides_controller')
const ArticleCategoriesController = () => import('#controllers/article_categories_controller')
const ArticlesController = () => import('#controllers/articles_controller')
const ArticleImagesController = () => import('#controllers/article_images_controller')
const ImagesController = () => import('#controllers/images_controller')
const GuideSectionsController = () => import('#controllers/guide_sections_controller')
const MaintenanceSettingsController = () => import('#controllers/maintenance_settings_controller')
const AuthController = () => import('#controllers/auth_controller')
const TiersController = () => import('#controllers/tiers_controller')
const CharactersController = () => import('#controllers/characters_controller')
const TierListsController = () => import('#controllers/tier_lists_controller')
const TierListCategoriesController = () => import('#controllers/tier_list_categories_controller')
const TierListEntriesController = () => import('#controllers/tier_list_entries_controller')

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/
import { middleware } from '#start/kernel'

/*
|--------------------------------------------------------------------------
| Rate Limiters
|--------------------------------------------------------------------------
*/
import {
  throttleRegister,
  throttleLogin,
  throttleChangePassword,
  throttleAdminWrite,
} from '#start/limiter'

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    // Authentication
    router
      .group(() => {
        router
          .post('/register', [AuthController, 'register'])
          .use([middleware.guest(), throttleRegister])
        router
          .post('/login', [AuthController, 'login'])
          .use([middleware.guest(), throttleLogin])
        router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
        router.get('/me', [AuthController, 'me']).use(middleware.auth())
        router
          .post('/change-password', [AuthController, 'changePassword'])
          .use([middleware.auth(), throttleChangePassword])
      })
      .prefix('auth')

    // Games
    router
      .group(() => {
        router.get('/', [GamesController, 'index'])
        router.get('/popular', [GamesController, 'popular'])
        router.get('/:slug', [GamesController, 'show'])
      })
      .prefix('games')

    // YouTube Videos
    router
      .group(() => {
        router.get('/', [YoutubeVideosController, 'index'])
        router.get('/active', [YoutubeVideosController, 'active'])
        router.get('/:id', [YoutubeVideosController, 'show'])
      })
      .prefix('youtube-videos')

    // Genres
    router
      .group(() => {
        router.get('/', [GenresController, 'index'])
        router.get('/:id', [GenresController, 'show'])
      })
      .prefix('genres')

    // Platforms
    router
      .group(() => {
        router.get('/', [PlatformsController, 'index'])
        router.get('/:id', [PlatformsController, 'show'])
      })
      .prefix('platforms')

    // Tags
    router
      .group(() => {
        router.get('/', [TagsController, 'index'])
        router.get('/:id', [TagsController, 'show'])
      })
      .prefix('tags')

    // Difficulty Levels
    router
      .group(() => {
        router.get('/', [DifficultyLevelsController, 'index'])
        router.get('/:id', [DifficultyLevelsController, 'show'])
      })
      .prefix('difficulty-levels')

    // SEO Keywords
    router
      .group(() => {
        router.get('/', [SeoKeywordsController, 'index'])
        router.get('/:id', [SeoKeywordsController, 'show'])
      })
      .prefix('seo-keywords')

    // Guide Types
    router
      .group(() => {
        router.get('/', [GuideTypesController, 'index'])
        router.get('/:id', [GuideTypesController, 'show'])
      })
      .prefix('guide-types')

    // Guides
    router
      .group(() => {
        router.get('/', [GuidesController, 'index'])
        router.get('/popular', [GuidesController, 'popular'])
        router.get('/slug/:slug', [GuidesController, 'showBySlug'])
        router.get('/game/:gameId', [GuidesController, 'byGame'])
        router.get('/:id', [GuidesController, 'show'])
      })
      .prefix('guides')

    // Article Categories
    router
      .group(() => {
        router.get('/', [ArticleCategoriesController, 'index'])
        router.get('/:id', [ArticleCategoriesController, 'show'])
      })
      .prefix('article-categories')

    // Articles
    router
      .group(() => {
        router.get('/', [ArticlesController, 'index'])
        router.get('/popular', [ArticlesController, 'popular'])
        router.get('/slug/:slug', [ArticlesController, 'showBySlug'])
        router.get('/:id', [ArticlesController, 'show'])
      })
      .prefix('articles')

    // Maintenance
    router.get('/maintenance/status', [MaintenanceSettingsController, 'status'])

    // Tiers
    router
      .group(() => {
        router.get('/', [TiersController, 'index'])
        router.get('/:id', [TiersController, 'show'])
      })
      .prefix('tiers')

    // Characters
    router
      .group(() => {
        router.get('/', [CharactersController, 'index'])
        router.get('/slug/:slug', [CharactersController, 'showBySlug'])
        router.get('/game/:gameId', [CharactersController, 'byGame'])
        router.get('/:id', [CharactersController, 'show'])
      })
      .prefix('characters')

    // Tier Lists
    router
      .group(() => {
        router.get('/', [TierListsController, 'index'])
        router.get('/popular', [TierListsController, 'popular'])
        router.get('/slug/:slug', [TierListsController, 'showBySlug'])
        router.get('/game/:gameId', [TierListsController, 'byGame'])
        router.get('/:id', [TierListsController, 'show'])
      })
      .prefix('tier-lists')
  })
  .prefix('/api')

/*
|--------------------------------------------------------------------------
| Admin API Routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    // Games
    router
      .group(() => {
        router.get('/stats', [GamesController, 'stats'])
        router.get('/:id', [GamesController, 'show'])
        router.post('/', [GamesController, 'store'])
        router.put('/:id', [GamesController, 'update'])
        router.delete('/:id', [GamesController, 'destroy'])
      })
      .prefix('games')

    // YouTube Videos
    router
      .group(() => {
        router.post('/', [YoutubeVideosController, 'store'])
        router.put('/:id', [YoutubeVideosController, 'update'])
        router.delete('/:id', [YoutubeVideosController, 'destroy'])
      })
      .prefix('youtube-videos')

    // Genres
    router
      .group(() => {
        router.post('/', [GenresController, 'store'])
        router.put('/:id', [GenresController, 'update'])
        router.delete('/:id', [GenresController, 'destroy'])
      })
      .prefix('genres')

    // Platforms
    router
      .group(() => {
        router.post('/', [PlatformsController, 'store'])
        router.put('/:id', [PlatformsController, 'update'])
        router.delete('/:id', [PlatformsController, 'destroy'])
      })
      .prefix('platforms')

    // Tags
    router
      .group(() => {
        router.post('/', [TagsController, 'store'])
        router.put('/:id', [TagsController, 'update'])
        router.delete('/:id', [TagsController, 'destroy'])
      })
      .prefix('tags')

    // Difficulty Levels
    router
      .group(() => {
        router.post('/', [DifficultyLevelsController, 'store'])
        router.put('/:id', [DifficultyLevelsController, 'update'])
        router.delete('/:id', [DifficultyLevelsController, 'destroy'])
      })
      .prefix('difficulty-levels')

    // SEO Keywords
    router
      .group(() => {
        router.post('/', [SeoKeywordsController, 'store'])
        router.put('/:id', [SeoKeywordsController, 'update'])
        router.delete('/:id', [SeoKeywordsController, 'destroy'])
      })
      .prefix('seo-keywords')

    // Guide Types
    router
      .group(() => {
        router.post('/', [GuideTypesController, 'store'])
        router.put('/:id', [GuideTypesController, 'update'])
        router.delete('/:id', [GuideTypesController, 'destroy'])
      })
      .prefix('guide-types')

    // Guides
    router
      .group(() => {
        router.post('/', [GuidesController, 'store'])
        router.put('/:id', [GuidesController, 'update'])
        router.delete('/:id', [GuidesController, 'destroy'])

        // Guide Sections
        router.get('/:id/sections', [GuideSectionsController, 'index'])
        router.post('/:id/sections', [GuideSectionsController, 'store'])
        router.get('/sections/:id', [GuideSectionsController, 'show'])
        router.put('/sections/:id', [GuideSectionsController, 'update'])
        router.delete('/sections/:id', [GuideSectionsController, 'destroy'])
      })
      .prefix('guides')

    // Article Categories
    router
      .group(() => {
        router.post('/', [ArticleCategoriesController, 'store'])
        router.put('/:id', [ArticleCategoriesController, 'update'])
        router.delete('/:id', [ArticleCategoriesController, 'destroy'])
      })
      .prefix('article-categories')

    // Articles
    router
      .group(() => {
        router.post('/', [ArticlesController, 'store'])
        router.put('/:id', [ArticlesController, 'update'])
        router.delete('/:id', [ArticlesController, 'destroy'])

        // Article Images (gallery)
        router.get('/:id/images', [ArticleImagesController, 'index'])
        router.post('/:id/images', [ArticleImagesController, 'store'])
        router.delete('/:id/images/:imageId', [ArticleImagesController, 'destroy'])
      })
      .prefix('articles')

    // Images
    router
      .group(() => {
        router.get('/:id', [ImagesController, 'show'])
        router.delete('/:id', [ImagesController, 'destroy'])
      })
      .prefix('images')

    // Maintenance
    router
      .group(() => {
        router.put('/', [MaintenanceSettingsController, 'update'])
        router.patch('/enable', [MaintenanceSettingsController, 'enable'])
        router.patch('/disable', [MaintenanceSettingsController, 'disable'])
      })
      .prefix('maintenance')

    // Tiers
    router
      .group(() => {
        router.put('/:id', [TiersController, 'update'])
      })
      .prefix('tiers')

    // Characters
    router
      .group(() => {
        router.post('/', [CharactersController, 'store'])
        router.put('/:id', [CharactersController, 'update'])
        router.delete('/:id', [CharactersController, 'destroy'])
      })
      .prefix('characters')

    // Tier Lists
    router
      .group(() => {
        router.post('/', [TierListsController, 'store'])
        router.put('/:id', [TierListsController, 'update'])
        router.patch('/:id/publish', [TierListsController, 'publish'])
        router.patch('/:id/unpublish', [TierListsController, 'unpublish'])
        router.delete('/:id', [TierListsController, 'destroy'])

        // Nested categories and entries
        router.get('/:id/categories', [TierListCategoriesController, 'index'])
        router.post('/:id/categories', [TierListCategoriesController, 'store'])
        router.get('/:id/entries', [TierListEntriesController, 'index'])
        router.post('/:id/entries', [TierListEntriesController, 'store'])
      })
      .prefix('tier-lists')

    // Tier List Categories (standalone)
    router
      .group(() => {
        router.get('/:id', [TierListCategoriesController, 'show'])
        router.put('/:id', [TierListCategoriesController, 'update'])
        router.delete('/:id', [TierListCategoriesController, 'destroy'])
      })
      .prefix('tier-lists/categories')

    // Tier List Entries (standalone)
    router
      .group(() => {
        router.post('/bulk-update', [TierListEntriesController, 'bulkUpdate'])
        router.get('/:id', [TierListEntriesController, 'show'])
        router.put('/:id', [TierListEntriesController, 'update'])
        router.delete('/:id', [TierListEntriesController, 'destroy'])
      })
      .prefix('tier-lists/entries')
  })
  .prefix('/api/admin')
  .use([middleware.auth(), middleware.role({ roles: ['admin', 'editor'] }), throttleAdminWrite])
