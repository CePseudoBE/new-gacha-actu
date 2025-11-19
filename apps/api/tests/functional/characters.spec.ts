import { test } from '@japa/runner'

test.group('Characters API', () => {
  test('GET /api/characters should return characters list', async ({ client }) => {
    const response = await client.get('/api/characters')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      data: {},
      meta: {},
    })
  })

  test('GET /api/characters with pagination should work', async ({ client }) => {
    const response = await client.get('/api/characters?page=1&perPage=10')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })

  test('GET /api/characters with filters should work', async ({ client }) => {
    const response = await client.get('/api/characters?rarity=SSR&element=Fire')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })

  test('GET /api/characters/:id should return 404 for non-existent character', async ({
    client,
  }) => {
    const response = await client.get('/api/characters/99999')

    response.assertStatus(404)
  })

  test('GET /api/characters/slug/:slug should return 404 for non-existent slug', async ({
    client,
  }) => {
    const response = await client.get('/api/characters/slug/non-existent-character')

    response.assertStatus(404)
  })

  test('GET /api/characters/game/:gameId should work with valid gameId', async ({ client }) => {
    const response = await client.get('/api/characters/game/1')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })

  test('GET /api/characters/game/:gameId with limit should work', async ({ client }) => {
    const response = await client.get('/api/characters/game/1?limit=5')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })
})
