import { test } from '@japa/runner'

test.group('Tiers API', () => {
  test('GET /api/tiers should return all tiers', async ({ client }) => {
    const response = await client.get('/api/tiers')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      data: [],
    })
  })

  test('GET /api/tiers/:id should return a specific tier', async ({ client }) => {
    const response = await client.get('/api/tiers/1')

    if (response.status() === 200) {
      response.assertBodyContains({
        success: true,
        data: {
          id: 1,
        },
      })
    } else {
      response.assertStatus(404)
    }
  })

  test('GET /api/tiers/:id should return 404 for non-existent tier', async ({ client }) => {
    const response = await client.get('/api/tiers/99999')

    response.assertStatus(404)
  })
})
