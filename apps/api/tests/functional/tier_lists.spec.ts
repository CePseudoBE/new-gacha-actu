import { test } from '@japa/runner'

test.group('Tier Lists API', () => {
  test('GET /api/tier-lists should return tier lists', async ({ client }) => {
    const response = await client.get('/api/tier-lists')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      data: {},
      meta: {},
    })
  })

  test('GET /api/tier-lists with pagination should work', async ({ client }) => {
    const response = await client.get('/api/tier-lists?page=1&perPage=10')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })

  test('GET /api/tier-lists with filters should work', async ({ client }) => {
    const response = await client.get('/api/tier-lists?isPublished=true')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })

  test('GET /api/tier-lists/popular should return popular tier lists', async ({ client }) => {
    const response = await client.get('/api/tier-lists/popular')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })

  test('GET /api/tier-lists/popular with limit should work', async ({ client }) => {
    const response = await client.get('/api/tier-lists/popular?limit=5')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })

  test('GET /api/tier-lists/:id should return 404 for non-existent tier list', async ({
    client,
  }) => {
    const response = await client.get('/api/tier-lists/99999')

    response.assertStatus(404)
  })

  test('GET /api/tier-lists/slug/:slug should return 404 for non-existent slug', async ({
    client,
  }) => {
    const response = await client.get('/api/tier-lists/slug/non-existent-tier-list')

    response.assertStatus(404)
  })

  test('GET /api/tier-lists/game/:gameId should work with valid gameId', async ({ client }) => {
    const response = await client.get('/api/tier-lists/game/1')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })

  test('GET /api/tier-lists/game/:gameId with limit should work', async ({ client }) => {
    const response = await client.get('/api/tier-lists/game/1?limit=5')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })
})
