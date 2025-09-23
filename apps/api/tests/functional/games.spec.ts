import { test } from '@japa/runner'

test.group('Games API', () => {
  test('GET /api/games should return games list', async ({ client }) => {
    const response = await client.get('/api/games')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      data: {},
      meta: {},
    })
  })

  test('GET /api/games with pagination should work', async ({ client }) => {
    const response = await client.get('/api/games?page=1&perPage=5')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })

  test('GET /api/games/popular should return popular games', async ({ client }) => {
    const response = await client.get('/api/games/popular')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })

  test('GET /api/games/popular with limit should work', async ({ client }) => {
    const response = await client.get('/api/games/popular?limit=3')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })

  test('GET /api/games/:slug should return 404 for non-existent game', async ({ client }) => {
    const response = await client.get('/api/games/non-existent-game')

    response.assertStatus(404)
    response.assertBodyContains({
      success: false,
      error: 'Jeu non trouvé',
    })
  })
})
