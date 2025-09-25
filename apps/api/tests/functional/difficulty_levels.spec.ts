import { test } from '@japa/runner'

test.group('DifficultyLevels CRUD', () => {
  let createdDifficultyLevelId: number

  test('should create a difficulty level', async ({ client, assert }) => {
    const difficultyLevelData = {
      name: 'Beginner',
    }

    const response = await client.post('/api/admin/difficulty-levels').json(difficultyLevelData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Niveau de difficulté créé avec succès',
    })

    createdDifficultyLevelId = response.body().data.id
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.name, difficultyLevelData.name)
    assert.exists(response.body().data.slug)
  })

  test('should get difficulty level by id', async ({ client, assert }) => {
    const response = await client.get(`/api/difficulty-levels/${createdDifficultyLevelId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.equal(response.body().data.id, createdDifficultyLevelId)
    assert.equal(response.body().data.name, 'Beginner')
  })

  test('should update difficulty level', async ({ client }) => {
    const updateData = {
      name: 'Beginner Updated',
    }

    const response = await client
      .put(`/api/admin/difficulty-levels/${createdDifficultyLevelId}`)
      .json(updateData)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Niveau de difficulté mis à jour avec succès',
      data: {
        id: createdDifficultyLevelId,
        name: updateData.name,
        slug: 'beginner',
      },
    })
  })

  test('should get updated difficulty level', async ({ client, assert }) => {
    const response = await client.get(`/api/difficulty-levels/${createdDifficultyLevelId}`)

    response.assertStatus(200)
    assert.equal(response.body().data.name, 'Beginner Updated')
  })

  test('should delete difficulty level', async ({ client }) => {
    const response = await client.delete(`/api/admin/difficulty-levels/${createdDifficultyLevelId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Niveau de difficulté supprimé avec succès',
    })
  })

  test('should return 404 for deleted difficulty level', async ({ client }) => {
    const response = await client.get(`/api/difficulty-levels/${createdDifficultyLevelId}`)
    response.assertStatus(404)
  })

  test('should get all difficulty levels', async ({ client, assert }) => {
    await client.post('/api/admin/difficulty-levels').json({ name: 'Intermediate' })
    await client.post('/api/admin/difficulty-levels').json({ name: 'Advanced' })

    const response = await client.get('/api/difficulty-levels')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.lengthOf(response.body().data, 2)
    assert.isArray(response.body().data)
  })

  test('should fail to create difficulty level with invalid data', async ({ client }) => {
    const response = await client.post('/api/admin/difficulty-levels').json({})

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

  test('should fail to update difficulty level with invalid data', async ({ client }) => {
    const difficultyLevelResponse = await client
      .post('/api/admin/difficulty-levels')
      .json({ name: 'TestDifficulty' })
    const difficultyLevelId = difficultyLevelResponse.body().data.id

    const response = await client
      .put(`/api/admin/difficulty-levels/${difficultyLevelId}`)
      .json({ name: 'x' })

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
