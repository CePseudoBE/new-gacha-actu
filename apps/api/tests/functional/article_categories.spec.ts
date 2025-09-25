import { test } from '@japa/runner'

test.group('ArticleCategories CRUD', () => {
  let createdArticleCategoryId: number

  test('should create an article category', async ({ client, assert }) => {
    const categoryData = {
      name: 'Guides',
      description: 'Catégorie pour les guides de jeux',
    }

    const response = await client.post('/api/admin/article-categories').json(categoryData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: "Catégorie d'article créée avec succès",
    })

    createdArticleCategoryId = response.body().data.id
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.name, categoryData.name)
    assert.equal(response.body().data.description, categoryData.description)
  })

  test('should get article category by id', async ({ client, assert }) => {
    const response = await client.get(`/api/article-categories/${createdArticleCategoryId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.equal(response.body().data.id, createdArticleCategoryId)
    assert.equal(response.body().data.name, 'Guides')
  })

  test('should update article category', async ({ client }) => {
    const updateData = {
      name: 'Guides Avancés',
      description: 'Guides pour joueurs expérimentés',
    }

    const response = await client
      .put(`/api/admin/article-categories/${createdArticleCategoryId}`)
      .json(updateData)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: "Catégorie d'article mise à jour avec succès",
      data: {
        id: createdArticleCategoryId,
        name: updateData.name,
        description: updateData.description,
      },
    })
  })

  test('should get updated article category', async ({ client, assert }) => {
    const response = await client.get(`/api/article-categories/${createdArticleCategoryId}`)

    response.assertStatus(200)
    assert.equal(response.body().data.name, 'Guides Avancés')
    assert.equal(response.body().data.description, 'Guides pour joueurs expérimentés')
  })

  test('should delete article category', async ({ client }) => {
    const response = await client.delete(
      `/api/admin/article-categories/${createdArticleCategoryId}`
    )

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: "Catégorie d'article supprimée avec succès",
    })
  })

  test('should return 404 for deleted article category', async ({ client }) => {
    const response = await client.get(`/api/article-categories/${createdArticleCategoryId}`)
    response.assertStatus(404)
  })

  test('should get all article categories', async ({ client, assert }) => {
    await client
      .post('/api/admin/article-categories')
      .json({ name: 'Actualités', description: 'News du gaming' })
    await client
      .post('/api/admin/article-categories')
      .json({ name: 'Reviews', description: 'Critiques de jeux' })

    const response = await client.get('/api/article-categories')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.isArray(response.body().data)
    assert.isAtLeast(response.body().data.length, 2)

    const categoryNames = response.body().data.map((c: any) => c.name)
    assert.include(categoryNames, 'Actualités')
    assert.include(categoryNames, 'Reviews')
  })

  test('should fail to create article category with invalid data', async ({ client }) => {
    const response = await client.post('/api/admin/article-categories').json({})

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

  test('should fail to update article category with invalid data', async ({ client }) => {
    const categoryResponse = await client
      .post('/api/admin/article-categories')
      .json({ name: 'TestCategory' })
    const categoryId = categoryResponse.body().data.id

    const response = await client
      .put(`/api/admin/article-categories/${categoryId}`)
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
