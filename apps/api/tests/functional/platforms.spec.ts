import { test } from '@japa/runner'

test.group('Platforms CRUD', () => {
  let createdPlatformId: number

  test('should create a platform', async ({ client, assert }) => {
    const platformData = {
      name: 'iOS',
    }

    const response = await client.post('/api/admin/platforms').json(platformData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Platform créée avec succès',
    })

    createdPlatformId = response.body().data.id
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.name, platformData.name)
    assert.exists(response.body().data.slug)
  })

  test('should get platform by id', async ({ client, assert }) => {
    const response = await client.get(`/api/platforms/${createdPlatformId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.equal(response.body().data.id, createdPlatformId)
    assert.equal(response.body().data.name, 'iOS')
  })

  test('should update platform', async ({ client }) => {
    const updateData = {
      name: 'iOS Updated',
    }

    const response = await client.put(`/api/admin/platforms/${createdPlatformId}`).json(updateData)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Platform mise à jour avec succès',
      data: {
        id: createdPlatformId,
        name: updateData.name,
        slug: 'ios',
      },
    })
  })

  test('should get updated platform', async ({ client, assert }) => {
    const response = await client.get(`/api/platforms/${createdPlatformId}`)

    response.assertStatus(200)
    assert.equal(response.body().data.name, 'iOS Updated')
  })

  test('should delete platform', async ({ client }) => {
    const response = await client.delete(`/api/admin/platforms/${createdPlatformId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Platform supprimée avec succès',
    })
  })

  test('should return 404 for deleted platform', async ({ client }) => {
    const response = await client.get(`/api/platforms/${createdPlatformId}`)
    response.assertStatus(404)
  })

  test('should get all platforms', async ({ client, assert }) => {
    await client.post('/api/admin/platforms').json({ name: 'Steam' })
    await client.post('/api/admin/platforms').json({ name: 'Epic Games' })

    const response = await client.get('/api/platforms')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.isArray(response.body().data)
    assert.isAtLeast(response.body().data.length, 2)

    const platformNames = response.body().data.map((p: any) => p.name)
    assert.include(platformNames, 'Steam')
    assert.include(platformNames, 'Epic Games')
  })

  test('should fail to create platform with invalid data', async ({ client }) => {
    const response = await client.post('/api/admin/platforms').json({})

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'name',
          rule: 'required',
        },
      ],
    })
  })

  test('should fail to update platform with invalid data', async ({ client }) => {
    const platformResponse = await client
      .post('/api/admin/platforms')
      .json({ name: 'TestPlatform' })
    const platformId = platformResponse.body().data.id

    const response = await client.put(`/api/admin/platforms/${platformId}`).json({ name: 'x' })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'name',
          rule: 'minLength',
        },
      ],
    })
  })
})
