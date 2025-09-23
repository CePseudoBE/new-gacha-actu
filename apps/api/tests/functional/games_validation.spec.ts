import { test } from '@japa/runner'

test.group('Games API Validation', () => {

  test('GET /api/games should fail with invalid page parameter', async ({ client }) => {
    const response = await client.get('/api/games?page=abc')

    // Devrait retourner 422 (validation error)
    response.assertStatus(422)
  })

  test('GET /api/games should fail with negative page', async ({ client }) => {
    const response = await client.get('/api/games?page=-1')

    response.assertStatus(422)
  })

  test('GET /api/games should fail with perPage too high', async ({ client }) => {
    const response = await client.get('/api/games?perPage=999')

    response.assertStatus(422)
  })

  test('GET /api/games/popular should fail with invalid limit', async ({ client }) => {
    const response = await client.get('/api/games/popular?limit=abc')

    response.assertStatus(422)
  })

  test('GET /api/games/popular should fail with limit too high', async ({ client }) => {
    const response = await client.get('/api/games/popular?limit=999')

    response.assertStatus(422)
  })

  test('POST /admin/games should fail without required fields', async ({ client }) => {
    const response = await client.post('/api/admin/games').json({
      // Pas de name, description, releaseDate requis
    })

    response.assertStatus(422)
  })

  test('POST /admin/games should fail with invalid date', async ({ client }) => {
    const response = await client.post('/api/admin/games').json({
      name: 'Test Game',
      description: 'Test description',
      releaseDate: 'invalid-date'
    })

    response.assertStatus(422)
  })

  test('POST /admin/games should fail with short name', async ({ client }) => {
    const response = await client.post('/api/admin/games').json({
      name: 'X', // Trop court (< 2 caractères)
      description: 'Test description with enough characters',
      releaseDate: '2024-01-01'
    })

    response.assertStatus(422)
  })

  test('POST /admin/games should fail with short description', async ({ client }) => {
    const response = await client.post('/api/admin/games').json({
      name: 'Valid Game Name',
      description: 'Short', // Trop court (< 10 caractères)
      releaseDate: '2024-01-01'
    })

    response.assertStatus(422)
  })
})