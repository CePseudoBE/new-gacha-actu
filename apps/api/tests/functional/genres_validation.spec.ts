import { test } from '@japa/runner'

test.group('Genres API Validation', () => {
  test('GET /api/genres should fail with invalid pagination', async ({ client }) => {
    const response = await client.get('/api/genres?page=-1&perPage=999')
    response.assertStatus(422)
  })

  test('POST /api/admin/genres should fail with missing required fields', async ({ client }) => {
    const response = await client.post('/api/admin/genres').json({})
    response.assertStatus(422)
  })

  test('POST /api/admin/genres should fail with invalid data', async ({ client }) => {
    const response = await client.post('/api/admin/genres').json({
      name: 'X',
      description: 'Too short'
    })
    response.assertStatus(422)
  })

  test('PUT /api/admin/genres/:id should return 404 for non-existent id', async ({ client }) => {
    const response = await client.put('/api/admin/genres/999999').json({ name: 'Test' })
    response.assertStatus(404)
  })

  test('DELETE /api/admin/genres/:id should return 404 for non-existent id', async ({ client }) => {
    const response = await client.delete('/api/admin/genres/999999')
    response.assertStatus(404)
  })
})