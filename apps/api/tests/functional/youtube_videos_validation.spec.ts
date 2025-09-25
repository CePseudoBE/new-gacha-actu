import { test } from '@japa/runner'

test.group('YouTube Videos API Validation', () => {
  test('GET /api/youtube-videos/active should fail with invalid limit', async ({ client }) => {
    const response = await client.get('/api/youtube-videos/active?limit=999')
    response.assertStatus(422)
  })

  test('POST /api/admin/youtube-videos should fail with missing required fields', async ({
    client,
  }) => {
    const response = await client.post('/api/admin/youtube-videos').json({})
    response.assertStatus(422)
  })

  test('POST /api/admin/youtube-videos should fail with invalid data', async ({ client }) => {
    const response = await client.post('/api/admin/youtube-videos').json({
      videoId: '',
      title: 'x'.repeat(201),
      thumbnail: 'not-a-url',
      viewCount: -1,
      gameId: 999999,
    })
    response.assertStatus(422)
  })

  test('PUT /api/admin/youtube-videos/:id should return 404 for non-existent id', async ({
    client,
  }) => {
    const response = await client.put('/api/admin/youtube-videos/999999').json({ title: 'Test' })
    response.assertStatus(404)
  })

  test('DELETE /api/admin/youtube-videos/:id should return 404 for non-existent id', async ({
    client,
  }) => {
    const response = await client.delete('/api/admin/youtube-videos/999999')
    response.assertStatus(404)
  })
})
