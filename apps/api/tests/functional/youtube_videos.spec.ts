import { test } from '@japa/runner'

test.group('YouTube Videos API', () => {
  test('GET /api/youtube-videos should return all videos', async ({ client }) => {
    const response = await client.get('/api/youtube-videos')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      data: [],
    })
  })

  test('GET /api/youtube-videos/active should return active videos', async ({ client }) => {
    const response = await client.get('/api/youtube-videos/active')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })

  test('GET /api/youtube-videos/active with limit should work', async ({ client }) => {
    const response = await client.get('/api/youtube-videos/active?limit=5')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })
  })

  test('GET /api/youtube-videos/:id should return 404 for non-existent video', async ({ client }) => {
    const response = await client.get('/api/youtube-videos/999999')

    response.assertStatus(404)
  })
})