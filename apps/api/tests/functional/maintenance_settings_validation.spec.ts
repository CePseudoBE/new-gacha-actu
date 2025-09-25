import { test } from '@japa/runner'

test.group('Maintenance Settings Validation', () => {
  test('PUT /api/admin/maintenance should work with minimal data', async ({ client }) => {
    const response = await client.put('/api/admin/maintenance').json({
      isEnabled: false,
    })
    response.assertStatus(200)
  })

  test('PUT /api/admin/maintenance should fail with invalid estimatedEndTime', async ({
    client,
  }) => {
    const response = await client.put('/api/admin/maintenance').json({
      isEnabled: true,
      estimatedEndTime: 'invalid-date',
    })
    response.assertStatus(422)
  })

  test('PATCH /api/admin/maintenance/enable should work without message', async ({ client }) => {
    const response = await client.patch('/api/admin/maintenance/enable')
    response.assertStatus(200)
  })
})
