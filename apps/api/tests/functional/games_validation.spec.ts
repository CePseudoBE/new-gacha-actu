import { test } from '@japa/runner'

test.group('Games API Validation', () => {
  test('GET /api/games should fail with invalid pagination', async ({ client }) => {
    const response = await client.get('/api/games?page=abc&perPage=999')
    response.assertStatus(422)
  })

  test('POST /admin/games should fail with missing required fields', async ({ client }) => {
    const response = await client.post('/api/admin/games').json({})
    response.assertStatus(422)
  })

  test('POST /admin/games should fail with invalid data', async ({ client }) => {
    const response = await client.post('/api/admin/games').json({
      name: 'X',
      description: 'Too short',
      releaseDate: 'invalid-date',
      genreIds: [],
      platformIds: [999999],
    })
    response.assertStatus(422)
  })

  test('PUT /admin/games/:id should return 404 for non-existent id', async ({ client }) => {
    const response = await client.put('/api/admin/games/999999').json({ name: 'Test' })
    response.assertStatus(404)
  })

  test('DELETE /admin/games/:id should return 404 for non-existent id', async ({ client }) => {
    const response = await client.delete('/api/admin/games/999999')
    response.assertStatus(404)
  })
})
