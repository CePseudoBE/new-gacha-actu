import { test } from '@japa/runner'

test.group('SeoKeywords CRUD', () => {
  let createdSeoKeywordId: number

  test('should create a seo keyword', async ({ client, assert }) => {
    const seoKeywordData = {
      keyword: 'genshin impact',
    }

    const response = await client.post('/api/admin/seo-keywords').json(seoKeywordData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Mot-clé SEO créé avec succès',
    })

    createdSeoKeywordId = response.body().data.id
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.keyword, seoKeywordData.keyword)
  })

  test('should get seo keyword by id', async ({ client, assert }) => {
    const response = await client.get(`/api/seo-keywords/${createdSeoKeywordId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.equal(response.body().data.id, createdSeoKeywordId)
    assert.equal(response.body().data.keyword, 'genshin impact')
  })

  test('should update seo keyword', async ({ client }) => {
    const updateData = {
      keyword: 'genshin impact tips',
    }

    const response = await client
      .put(`/api/admin/seo-keywords/${createdSeoKeywordId}`)
      .json(updateData)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Mot-clé SEO mis à jour avec succès',
      data: {
        id: createdSeoKeywordId,
        keyword: updateData.keyword,
      },
    })
  })

  test('should get updated seo keyword', async ({ client, assert }) => {
    const response = await client.get(`/api/seo-keywords/${createdSeoKeywordId}`)

    response.assertStatus(200)
    assert.equal(response.body().data.keyword, 'genshin impact tips')
  })

  test('should delete seo keyword', async ({ client }) => {
    const response = await client.delete(`/api/admin/seo-keywords/${createdSeoKeywordId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Mot-clé SEO supprimé avec succès',
    })
  })

  test('should return 404 for deleted seo keyword', async ({ client }) => {
    const response = await client.get(`/api/seo-keywords/${createdSeoKeywordId}`)
    response.assertStatus(404)
  })

  test('should get all seo keywords', async ({ client, assert }) => {
    await client.post('/api/admin/seo-keywords').json({ keyword: 'honkai star rail' })
    await client.post('/api/admin/seo-keywords').json({ keyword: 'fire emblem heroes' })

    const response = await client.get('/api/seo-keywords')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.isArray(response.body().data)
    assert.isAtLeast(response.body().data.length, 2)

    const keywordNames = response.body().data.map((k: any) => k.keyword)
    assert.include(keywordNames, 'honkai star rail')
    assert.include(keywordNames, 'fire emblem heroes')
  })

  test('should fail to create seo keyword with invalid data', async ({ client }) => {
    const response = await client.post('/api/admin/seo-keywords').json({})

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'keyword',
          rule: 'required',
        },
      ],
    })
  })

  test('should fail to update seo keyword with invalid data', async ({ client }) => {
    const seoKeywordResponse = await client
      .post('/api/admin/seo-keywords')
      .json({ keyword: 'TestKeyword' })
    const seoKeywordId = seoKeywordResponse.body().data.id

    const response = await client
      .put(`/api/admin/seo-keywords/${seoKeywordId}`)
      .json({ keyword: 'x' })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'keyword',
          rule: 'minLength',
        },
      ],
    })
  })
})
