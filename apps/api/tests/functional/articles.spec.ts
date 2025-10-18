import { test } from '@japa/runner'

test.group('Articles CRUD', () => {
  let createdGameId: number
  let createdCategoryId: number
  let createdArticleId: number

  test('setup: create game for articles', async ({ client }) => {
    // Créer d'abord un genre
    const genreResponse = await client.post('/api/admin/genres').json({
      name: 'Test Genre for Articles',
      description: 'Genre for testing articles',
    })
    const genreId = genreResponse.body().data.id

    const gameData = {
      name: 'Test Game for Articles',
      description: 'A game for testing articles',
      developer: 'Test Studio',
      releaseDate: '2024-01-01',
      genreId: genreId,
      isPopular: false,
    }

    const response = await client.post('/api/admin/games').json(gameData)
    createdGameId = response.body().data.id
  })

  test('setup: create category for articles', async ({ client }) => {
    const categoryData = {
      name: 'Test Category',
      description: 'A category for testing',
    }

    const response = await client.post('/api/admin/article-categories').json(categoryData)
    createdCategoryId = response.body().data.id
  })

  test('should create an article', async ({ client, assert }) => {
    const articleData = {
      title: 'Guide complet pour débutants',
      summary: 'Un guide détaillé pour bien commencer le jeu avec toutes les astuces nécessaires.',
      author: 'TestAuthor',
      publishedAt: '2024-01-15 10:00:00',
      content:
        "Contenu détaillé de l'article avec plus de 50 caractères pour respecter la validation minimale requise.",
      metaDescription: 'Guide complet pour les nouveaux joueurs',
      readingTime: 5,
      categoryId: createdCategoryId,
      isPopular: true,
      gameId: createdGameId,
    }

    const response = await client.post('/api/admin/articles').json(articleData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Article créé avec succès',
    })

    createdArticleId = response.body().data.id
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.title, articleData.title)
    assert.equal(response.body().data.author, articleData.author)
    assert.equal(response.body().data.gameId, createdGameId)
    assert.equal(response.body().data.categoryId, createdCategoryId)
  })

  test('should get article by id', async ({ client, assert }) => {
    const response = await client.get(`/api/articles/${createdArticleId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.equal(response.body().data.id, createdArticleId)
    assert.equal(response.body().data.title, 'Guide complet pour débutants')
    assert.exists(response.body().data.game)
    assert.exists(response.body().data.category)
  })

  test('should get article by slug', async ({ client, assert }) => {
    // Récupérer le slug généré
    const articleResponse = await client.get(`/api/articles/${createdArticleId}`)
    const slug = articleResponse.body().data.slug

    const response = await client.get(`/api/articles/slug/${slug}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.equal(response.body().data.id, createdArticleId)
    assert.equal(response.body().data.slug, slug)
  })

  test('should update article', async ({ client }) => {
    const updateData = {
      title: 'Guide complet pour débutants - Mis à jour',
      summary:
        'Un guide détaillé et mis à jour pour bien commencer le jeu avec toutes les nouvelles astuces.',
      isPopular: false,
    }

    const response = await client.put(`/api/admin/articles/${createdArticleId}`).json(updateData)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Article mis à jour avec succès',
      data: {
        id: createdArticleId,
        title: updateData.title,
        summary: updateData.summary,
        isPopular: false,
      },
    })
  })

  test('should get updated article', async ({ client, assert }) => {
    const response = await client.get(`/api/articles/${createdArticleId}`)

    response.assertStatus(200)
    assert.equal(response.body().data.title, 'Guide complet pour débutants - Mis à jour')
    assert.equal(response.body().data.isPopular, false)
  })

  test('should get popular articles', async ({ client, assert }) => {
    // Créer un autre article populaire
    await client.post('/api/admin/articles').json({
      title: 'Article populaire',
      summary: 'Un article très populaire avec beaucoup de vues',
      author: 'PopularAuthor',
      publishedAt: '2024-01-20 14:00:00',
      content: "Contenu de l'article populaire avec suffisamment de caractères pour la validation",
      isPopular: true,
      gameId: createdGameId,
    })

    const response = await client.get('/api/articles/popular')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.isArray(response.body().data)
    // Au moins un article populaire (celui qu'on vient de créer)
    assert.isAtLeast(response.body().data.length, 1)
  })

  test('should delete article', async ({ client }) => {
    const response = await client.delete(`/api/admin/articles/${createdArticleId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Article supprimé avec succès',
    })
  })

  test('should return 404 for deleted article', async ({ client }) => {
    const response = await client.get(`/api/articles/${createdArticleId}`)
    response.assertStatus(404)
  })

  test('should get all articles', async ({ client, assert }) => {
    const response = await client.get('/api/articles')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.isArray(response.body().data)
    // Au moins l'article populaire qu'on a créé
    assert.isAtLeast(response.body().data.length, 1)
  })

  test('should fail to create article with invalid data', async ({ client }) => {
    const response = await client.post('/api/admin/articles').json({})

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'title',
          rule: 'required',
        },
        {
          field: 'summary',
          rule: 'required',
        },
        {
          field: 'author',
          rule: 'required',
        },
        {
          field: 'publishedAt',
          rule: 'required',
        },
        {
          field: 'content',
          rule: 'required',
        },
        {
          field: 'gameId',
          rule: 'required',
        },
      ],
    })
  })

  test('should fail to update article with invalid data', async ({ client }) => {
    const articleResponse = await client.post('/api/admin/articles').json({
      title: 'Test Article',
      summary: 'Test summary for validation',
      author: 'TestAuthor',
      publishedAt: '2024-01-15',
      content: 'Test content with enough characters for validation rules',
      gameId: createdGameId,
    })
    const articleId = articleResponse.body().data.id

    const response = await client.put(`/api/admin/articles/${articleId}`).json({
      title: 'x', // Trop court
      summary: 'abc', // Trop court
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'title',
          rule: 'minLength',
        },
        {
          field: 'summary',
          rule: 'minLength',
        },
      ],
    })
  })

  // Tests pour les relations many-to-many
  test('should create article with tags and seo keywords', async ({ client, assert }) => {
    // Créer des tags
    const tag1Response = await client.post('/api/admin/tags').json({ name: 'Beginner Guide' })
    const tag2Response = await client.post('/api/admin/tags').json({ name: 'Tips & Tricks' })
    const tag1Id = tag1Response.body().data.id
    const tag2Id = tag2Response.body().data.id

    // Créer des mots-clés SEO
    const seo1Response = await client
      .post('/api/admin/seo-keywords')
      .json({ keyword: 'gaming guide' })
    const seo2Response = await client
      .post('/api/admin/seo-keywords')
      .json({ keyword: 'beginner tips' })
    const seo1Id = seo1Response.body().data.id
    const seo2Id = seo2Response.body().data.id

    const articleData = {
      title: 'Complete Guide with Relations',
      summary: 'An article with tags and SEO keywords to test relations',
      author: 'RelationsTester',
      publishedAt: '2024-02-01 10:00:00',
      content:
        'Content for testing relations between articles, tags and SEO keywords functionality.',
      gameId: createdGameId,
      categoryId: createdCategoryId,
      tagIds: [tag1Id, tag2Id],
      seoKeywordIds: [seo1Id, seo2Id],
    }

    const response = await client.post('/api/admin/articles').json(articleData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Article créé avec succès',
    })

    const articleId = response.body().data.id
    assert.exists(articleId)
    assert.equal(response.body().data.title, articleData.title)

    // Vérifier que l'article a bien les relations
    const getResponse = await client.get(`/api/articles/${articleId}`)
    getResponse.assertStatus(200)

    const articleWithRelations = getResponse.body().data
    assert.isArray(articleWithRelations.tags)
    assert.isArray(articleWithRelations.seoKeywords)
    assert.equal(articleWithRelations.tags.length, 2)
    assert.equal(articleWithRelations.seoKeywords.length, 2)

    // Vérifier les noms des tags
    const tagNames = articleWithRelations.tags.map((tag: any) => tag.name)
    assert.include(tagNames, 'Beginner Guide')
    assert.include(tagNames, 'Tips & Tricks')

    // Vérifier les mots-clés SEO
    const seoKeywords = articleWithRelations.seoKeywords.map((seo: any) => seo.keyword)
    assert.include(seoKeywords, 'gaming guide')
    assert.include(seoKeywords, 'beginner tips')
  })

  test('should update article relations', async ({ client, assert }) => {
    // Créer un article simple d'abord
    const simpleArticleResponse = await client.post('/api/admin/articles').json({
      title: 'Simple Article for Relations Update',
      summary: 'Article to test relations update functionality',
      author: 'UpdateTester',
      publishedAt: '2024-02-05',
      content: 'Content for testing relations update on existing articles without relations.',
      gameId: createdGameId,
    })
    const articleId = simpleArticleResponse.body().data.id

    // Créer de nouveaux tags et mots-clés
    const tagResponse = await client.post('/api/admin/tags').json({ name: 'Advanced' })
    const seoResponse = await client
      .post('/api/admin/seo-keywords')
      .json({ keyword: 'advanced tips' })
    const tagId = tagResponse.body().data.id
    const seoId = seoResponse.body().data.id

    // Mettre à jour avec des relations
    const updateResponse = await client.put(`/api/admin/articles/${articleId}`).json({
      tagIds: [tagId],
      seoKeywordIds: [seoId],
    })

    updateResponse.assertStatus(200)
    updateResponse.assertBodyContains({
      success: true,
      message: 'Article mis à jour avec succès',
    })

    // Vérifier les relations
    const getResponse = await client.get(`/api/articles/${articleId}`)
    const article = getResponse.body().data

    assert.equal(article.tags.length, 1)
    assert.equal(article.seoKeywords.length, 1)
    assert.equal(article.tags[0].name, 'Advanced')
    assert.equal(article.seoKeywords[0].keyword, 'advanced tips')
  })

  test('should remove relations when updating with empty arrays', async ({ client, assert }) => {
    // Créer un article avec des relations
    const tag = await client.post('/api/admin/tags').json({ name: 'Temporary Tag' })
    const seo = await client.post('/api/admin/seo-keywords').json({ keyword: 'temporary keyword' })

    const articleResponse = await client.post('/api/admin/articles').json({
      title: 'Article with Relations to Remove',
      summary: 'Article for testing relations removal functionality',
      author: 'RemovalTester',
      publishedAt: '2024-02-10',
      content: 'Content for testing removal of relations from articles with existing relations.',
      gameId: createdGameId,
      tagIds: [tag.body().data.id],
      seoKeywordIds: [seo.body().data.id],
    })
    const articleId = articleResponse.body().data.id

    // Supprimer les relations avec des tableaux vides
    await client.put(`/api/admin/articles/${articleId}`).json({
      tagIds: [],
      seoKeywordIds: [],
    })

    // Vérifier que les relations sont supprimées
    const getResponse = await client.get(`/api/articles/${articleId}`)
    const article = getResponse.body().data

    assert.equal(article.tags.length, 0)
    assert.equal(article.seoKeywords.length, 0)
  })
})
