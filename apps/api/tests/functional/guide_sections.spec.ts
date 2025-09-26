import { test } from '@japa/runner'
import drive from '@adonisjs/drive/services/main'
import fileGenerator from '@poppinss/file-generator'

test.group('Guide Sections CRUD', (group) => {
  let guideId: number

  group.setup(async () => {
    // Fake the drive during tests
    drive.fake()
  })

  group.teardown(async () => {
    // Restore the real drive
    drive.restore()
  })

  test('setup: create guide for sections', async ({ client }) => {
    // Créer les données de test nécessaires
    const genreResponse = await client.post('/api/admin/genres').json({
      name: 'Test Genre for Sections',
      description: 'Genre for testing sections',
    })
    const genreId = genreResponse.body().data.id

    const gameResponse = await client.post('/api/admin/games').json({
      name: 'Test Game for Sections',
      description: 'A game for testing sections',
      releaseDate: '2024-01-01T00:00:00.000Z',
      genreId: genreId,
      isPopular: false,
    })
    const gameId = gameResponse.body().data.id

    const difficultyResponse = await client.post('/api/admin/difficulty-levels').json({
      name: 'Test Difficulty for Sections',
      description: 'Difficulty for testing sections',
      level: 1,
    })
    const difficultyId = difficultyResponse.body().data.id

    const guideTypeResponse = await client.post('/api/admin/guide-types').json({
      name: 'Test Guide Type for Sections',
      description: 'Guide type for testing sections',
    })
    const guideTypeId = guideTypeResponse.body().data.id

    const guideResponse = await client.post('/api/admin/guides').json({
      title: 'Guide for Section Testing',
      summary: 'This is a test guide for section testing and has enough characters',
      author: 'Test Author',
      publishedAt: '2024-01-01 00:00:00',
      gameId: gameId,
      difficultyId: difficultyId,
      guideTypeId: guideTypeId,
      sections: [
        {
          title: 'Initial Section',
          content: 'This is the initial section content',
          order: 1,
        },
      ],
    })

    guideId = guideResponse.body().data.id
  })

  test('should get all sections for a guide', async ({ client, assert }) => {
    const response = await client.get(`/api/admin/guides/${guideId}/sections`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 1) // Initial section from setup
    assert.equal(response.body().data[0].title, 'Initial Section')
  })

  test('should create a new section', async ({ client, assert }) => {
    const sectionData = {
      title: 'New Section',
      content: 'This is a new section with enough content to pass validation',
      order: 2,
    }

    const response = await client.post(`/api/admin/guides/${guideId}/sections`).json(sectionData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Section créée avec succès',
    })

    const responseData = response.body().data
    assert.exists(responseData.id)
    assert.equal(responseData.title, sectionData.title)
    assert.equal(responseData.content, sectionData.content)
    assert.equal(responseData.order, sectionData.order)
    assert.equal(responseData.guideId, guideId)
  })

  test('should create section with image', async ({ client, assert }) => {
    const { contents, mime, name } = await fileGenerator.generatePng('150kb')

    const response = await client
      .post(`/api/admin/guides/${guideId}/sections`)
      .field('title', 'Section with Image')
      .field('content', 'This section has an image attached and enough content')
      .field('order', '3')
      .file('image', contents, {
        filename: name,
        contentType: mime,
      })

    response.assertStatus(201)

    const responseData = response.body().data
    assert.exists(responseData.image)
    assert.isString(responseData.image.url)
    assert.isTrue(responseData.image.url.includes('/uploads/'))

    // Vérifier que le fichier existe dans le fake drive
    const fakeDisk = drive.fake()
    fakeDisk.assertExists(`images/${responseData.image.filename}`)
  })

  test('should get section by id', async ({ client, assert }) => {
    // D'abord créer une section
    const sectionResponse = await client.post(`/api/admin/guides/${guideId}/sections`).json({
      title: 'Section for Get Test',
      content: 'This section will be retrieved by ID with enough content',
      order: 4,
    })
    const sectionId = sectionResponse.body().data.id

    const response = await client.get(`/api/admin/guides/sections/${sectionId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    const responseData = response.body().data
    assert.equal(responseData.id, sectionId)
    assert.equal(responseData.title, 'Section for Get Test')
  })

  test('should update section', async ({ client, assert }) => {
    // D'abord créer une section
    const sectionResponse = await client.post(`/api/admin/guides/${guideId}/sections`).json({
      title: 'Section for Update',
      content: 'This section will be updated with enough content',
      order: 5,
    })
    const sectionId = sectionResponse.body().data.id

    const updateData = {
      title: 'Updated Section Title',
      content: 'This is the updated content with sufficient length',
    }

    const response = await client.put(`/api/admin/guides/sections/${sectionId}`).json(updateData)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Section mise à jour avec succès',
    })

    const responseData = response.body().data
    assert.equal(responseData.title, updateData.title)
    assert.equal(responseData.content, updateData.content)
    assert.equal(responseData.order, 5) // Should remain the same
  })

  test('should update section with image', async ({ client, assert }) => {
    // D'abord créer une section
    const sectionResponse = await client.post(`/api/admin/guides/${guideId}/sections`).json({
      title: 'Section for Image Update',
      content: 'This section will get an image added with enough content',
      order: 6,
    })
    const sectionId = sectionResponse.body().data.id

    const { contents, mime, name } = await fileGenerator.generateJpg('200kb')

    const response = await client
      .put(`/api/admin/guides/sections/${sectionId}`)
      .field('title', 'Section with Updated Image')
      .file('image', contents, {
        filename: name,
        contentType: mime,
      })

    response.assertStatus(200)

    const responseData = response.body().data
    assert.equal(responseData.title, 'Section with Updated Image')
    assert.exists(responseData.image)
    assert.isString(responseData.image.url)

    // Vérifier que le fichier existe dans le fake drive
    const fakeDisk = drive.fake()
    fakeDisk.assertExists(`images/${responseData.image.filename}`)
  })

  test('should delete section', async ({ client }) => {
    // D'abord créer une section
    const sectionResponse = await client.post(`/api/admin/guides/${guideId}/sections`).json({
      title: 'Section for Delete',
      content: 'This section will be deleted with enough content',
      order: 7,
    })
    const sectionId = sectionResponse.body().data.id

    const response = await client.delete(`/api/admin/guides/sections/${sectionId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Section supprimée avec succès',
    })

    // Vérifier que la section n'existe plus
    const getResponse = await client.get(`/api/admin/guides/sections/${sectionId}`)
    getResponse.assertStatus(404)
  })

  test('should validate section creation data', async ({ client }) => {
    const response = await client.post(`/api/admin/guides/${guideId}/sections`).json({
      title: '', // Invalid: empty title
      content: 'Short', // Invalid: too short
      order: -1, // Invalid: negative order
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'title',
          rule: 'required',
        },
        {
          field: 'content',
          rule: 'minLength',
        },
        {
          field: 'order',
          rule: 'min',
        },
      ],
    })
  })

  test('should return 404 for non-existent guide', async ({ client }) => {
    const response = await client.get('/api/admin/guides/99999/sections')

    response.assertStatus(404)
  })
})
