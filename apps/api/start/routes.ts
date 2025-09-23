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
| Games Routes
|--------------------------------------------------------------------------
*/
const GamesController = () => import('#controllers/games_controller')

// Routes publiques
router.group(() => {
  router.get('/games', [GamesController, 'index'])
  router.get('/games/popular', [GamesController, 'popular'])
  router.get('/games/:slug', [GamesController, 'show'])
}).prefix('/api')

// Routes admin
router.group(() => {
  router.post('/games', [GamesController, 'store'])
  router.put('/games/:id', [GamesController, 'update'])
  router.delete('/games/:id', [GamesController, 'destroy'])
  router.get('/games/stats', [GamesController, 'stats'])
}).prefix('/api/admin')
// TODO: Ajouter middleware auth admin
