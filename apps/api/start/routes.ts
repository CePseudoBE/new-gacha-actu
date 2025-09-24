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
const MaintenanceSettingsController = () => import('#controllers/maintenance_settings_controller')

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
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

    // Maintenance
    router.get('/maintenance/status', [MaintenanceSettingsController, 'status'])
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
        router.post('/', [GamesController, 'store'])
        router.put('/:id', [GamesController, 'update'])
        router.delete('/:id', [GamesController, 'destroy'])
        router.get('/stats', [GamesController, 'stats'])
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
        router.get('/all', [GenresController, 'all'])
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

    // Maintenance
    router
      .group(() => {
        router.put('/', [MaintenanceSettingsController, 'update'])
        router.patch('/enable', [MaintenanceSettingsController, 'enable'])
        router.patch('/disable', [MaintenanceSettingsController, 'disable'])
      })
      .prefix('maintenance')
  })
  .prefix('/api/admin')
// TODO: Ajouter middleware auth admin
