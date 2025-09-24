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

  test('should update tag', async ({ client, assert }) => {
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
      }
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

  test('should get paginated tags', async ({ client, assert }) => {
    
    await client.post('/api/admin/tags').json({ name: 'Gacha' })
    await client.post('/api/admin/tags').json({ name: 'Anime' })

    const response = await client.get('/api/tags?page=1&perPage=2')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.lengthOf(response.body().data, 2)
    assert.exists(response.body().meta.pagination)
  })

  test('should search tags', async ({ client, assert }) => {
    
    await client.post('/api/admin/tags').json({ name: 'Action' })
    await client.post('/api/admin/tags').json({ name: 'Adventure' })

    const response = await client.get('/api/tags?search=action')

    response.assertStatus(200)
    const data = response.body().data

    assert.isArray(data)
    
    const foundTag = data.find((tag: any) => tag.name.toLowerCase().includes('action'))
    assert.exists(foundTag)
  })
})