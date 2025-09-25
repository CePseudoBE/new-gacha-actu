import { test } from '@japa/runner'

test.group('Maintenance Settings', () => {
  test('GET /api/maintenance/status should return current status', async ({ client, assert }) => {
    const response = await client.get('/api/maintenance/status')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    const data = response.body().data
    assert.exists(data.id)
    assert.isBoolean(data.isEnabled)
    assert.isString(data.message)
    assert.isBoolean(data.allowAdminAccess)
    assert.exists(data.createdAt)
    assert.exists(data.updatedAt)
  })

  test('PUT /api/admin/maintenance should update maintenance settings', async ({
    client,
    assert,
  }) => {
    const updateData = {
      isEnabled: true,
      message: 'Maintenance en cours - Retour prévu dans 2h',
      allowAdminAccess: false,
    }

    const response = await client.put('/api/admin/maintenance').json(updateData)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Configuration de maintenance mise à jour avec succès',
    })

    const data = response.body().data
    assert.equal(data.isEnabled, true)
    assert.equal(data.message, updateData.message)
    assert.equal(data.allowAdminAccess, false)
  })

  test('PATCH /api/admin/maintenance/enable should enable maintenance', async ({
    client,
    assert,
  }) => {
    const response = await client.patch('/api/admin/maintenance/enable').json({
      message: 'Mise à jour du serveur en cours',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Maintenance activée avec succès',
    })

    const data = response.body().data
    assert.equal(data.isEnabled, true)
    assert.equal(data.message, 'Mise à jour du serveur en cours')
  })

  test('PATCH /api/admin/maintenance/enable should enable without custom message', async ({
    client,
    assert,
  }) => {
    const response = await client.patch('/api/admin/maintenance/enable').json({})

    response.assertStatus(200)
    const data = response.body().data
    assert.equal(data.isEnabled, true)
  })

  test('PATCH /api/admin/maintenance/disable should disable maintenance', async ({
    client,
    assert,
  }) => {
    await client.patch('/api/admin/maintenance/enable').json({})

    const response = await client.patch('/api/admin/maintenance/disable')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Maintenance désactivée avec succès',
    })

    const data = response.body().data
    assert.equal(data.isEnabled, false)
  })

  test('should persist changes between requests', async ({ client, assert }) => {
    await client.put('/api/admin/maintenance').json({
      isEnabled: true,
      message: 'Test persistence',
      allowAdminAccess: true,
    })

    const response = await client.get('/api/maintenance/status')
    const data = response.body().data

    assert.equal(data.isEnabled, true)
    assert.equal(data.message, 'Test persistence')
    assert.equal(data.allowAdminAccess, true)
  })

  test('should handle estimatedEndTime field', async ({ client, assert }) => {
    const futureTime = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()

    const response = await client.put('/api/admin/maintenance').json({
      isEnabled: true,
      message: 'Maintenance avec temps estimé',
      estimatedEndTime: futureTime,
    })

    response.assertStatus(200)
    const data = response.body().data
    assert.exists(data.estimatedEndTime)
  })
})
