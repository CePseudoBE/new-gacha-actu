import { test } from '@japa/runner'

test.group('GuideTypes CRUD', () => {
  let createdGuideTypeId: number

  test('should create a guide type', async ({ client, assert }) => {
    const guideTypeData = {
      name: 'Character Build',
      description: 'Guide pour les builds de personnages',
    }

    const response = await client.post('/api/admin/guide-types').json(guideTypeData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Type de guide créé avec succès',
    })

    createdGuideTypeId = response.body().data.id
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.name, guideTypeData.name)
    assert.equal(response.body().data.description, guideTypeData.description)
    assert.exists(response.body().data.slug)
  })

  test('should get guide type by id', async ({ client, assert }) => {
    const response = await client.get(`/api/guide-types/${createdGuideTypeId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.equal(response.body().data.id, createdGuideTypeId)
    assert.equal(response.body().data.name, 'Character Build')
    assert.equal(response.body().data.description, 'Guide pour les builds de personnages')
  })

  test('should update guide type', async ({ client }) => {
    const updateData = {
      name: 'Character Build Updated',
      description: 'Guide mis à jour pour les builds de personnages',
    }

    const response = await client
      .put(`/api/admin/guide-types/${createdGuideTypeId}`)
      .json(updateData)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Type de guide mis à jour avec succès',
      data: {
        id: createdGuideTypeId,
        name: updateData.name,
        description: updateData.description,
        slug: 'character-build',
      },
    })
  })

  test('should get updated guide type', async ({ client, assert }) => {
    const response = await client.get(`/api/guide-types/${createdGuideTypeId}`)

    response.assertStatus(200)
    assert.equal(response.body().data.name, 'Character Build Updated')
    assert.equal(
      response.body().data.description,
      'Guide mis à jour pour les builds de personnages'
    )
  })

  test('should delete guide type', async ({ client }) => {
    const response = await client.delete(`/api/admin/guide-types/${createdGuideTypeId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Type de guide supprimé avec succès',
    })
  })

  test('should return 404 for deleted guide type', async ({ client }) => {
    const response = await client.get(`/api/guide-types/${createdGuideTypeId}`)
    response.assertStatus(404)
  })

  test('should get all guide types', async ({ client, assert }) => {
    await client.post('/api/admin/guide-types').json({ name: 'Team Comp' })
    await client.post('/api/admin/guide-types').json({ name: 'Equipment' })

    const response = await client.get('/api/guide-types')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.isArray(response.body().data)
    assert.isAtLeast(response.body().data.length, 2)

    const typeNames = response.body().data.map((t: any) => t.name)
    assert.include(typeNames, 'Team Comp')
    assert.include(typeNames, 'Equipment')
  })

  test('should fail to create guide type with invalid data', async ({ client }) => {
    const response = await client.post('/api/admin/guide-types').json({})

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

  test('should fail to update guide type with invalid data', async ({ client }) => {
    const guideTypeResponse = await client
      .post('/api/admin/guide-types')
      .json({ name: 'TestGuideType' })
    const guideTypeId = guideTypeResponse.body().data.id

    const response = await client.put(`/api/admin/guide-types/${guideTypeId}`).json({ name: 'x' })

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
