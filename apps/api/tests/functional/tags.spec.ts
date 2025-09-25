import { test } from '@japa/runner'

test.group('Tags CRUD', () => {
  let createdTagId: number

  test('should create a tag', async ({ client, assert }) => {
    const tagData = {
      name: 'Action RPG',
    }

    const response = await client.post('/api/admin/tags').json(tagData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Tag créé avec succès',
    })

    createdTagId = response.body().data.id
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.name, tagData.name)
    assert.exists(response.body().data.slug)
  })

  test('should get tag by id', async ({ client, assert }) => {
    const response = await client.get(`/api/tags/${createdTagId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.equal(response.body().data.id, createdTagId)
    assert.equal(response.body().data.name, 'Action RPG')
  })

  test('should update tag', async ({ client }) => {
    const updateData = {
      name: 'Action RPG Updated',
    }

    const response = await client.put(`/api/admin/tags/${createdTagId}`).json(updateData)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Tag mis à jour avec succès',
      data: {
        id: createdTagId,
        name: updateData.name,
        slug: 'action-rpg',
      },
    })
  })

  test('should delete tag', async ({ client }) => {
    const response = await client.delete(`/api/admin/tags/${createdTagId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Tag supprimé avec succès',
    })
  })

  test('should return 404 for deleted tag', async ({ client }) => {
    const response = await client.get(`/api/tags/${createdTagId}`)
    response.assertStatus(404)
  })

  test('should get all tags', async ({ client, assert }) => {
    await client.post('/api/admin/tags').json({ name: 'Gacha' })
    await client.post('/api/admin/tags').json({ name: 'Anime' })

    const response = await client.get('/api/tags')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.isArray(response.body().data)
    assert.isAtLeast(response.body().data.length, 2)

    const tagNames = response.body().data.map((t: any) => t.name)
    assert.include(tagNames, 'Gacha')
    assert.include(tagNames, 'Anime')
  })

  test('should fail to create tag with invalid data', async ({ client }) => {
    const response = await client.post('/api/admin/tags').json({})

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

  test('should fail to update tag with invalid data', async ({ client }) => {
    const tagResponse = await client.post('/api/admin/tags').json({ name: 'TestTag' })
    const tagId = tagResponse.body().data.id

    const response = await client.put(`/api/admin/tags/${tagId}`).json({ name: 'x' })

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
