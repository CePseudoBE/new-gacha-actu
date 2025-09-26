import { test } from '@japa/runner'
import drive from '@adonisjs/drive/services/main'
import fileGenerator from '@poppinss/file-generator'

test.group('Guide Image Upload', (group) => {
  let fakeDisk: any

  group.setup(async () => {
    // Fake the drive during tests
    fakeDisk = drive.fake()
  })

  group.teardown(async () => {
    // Restore the real drive
    drive.restore()
  })

  test('should create guide with image upload', async ({ client, assert }) => {
    // Créer les données de test nécessaires
    const genreResponse = await client.post('/api/admin/genres').json({
      name: 'Test Genre for Guide Image',
      description: 'Genre for testing guide image uploads',
    })
    const genreId = genreResponse.body().data.id

    const gameResponse = await client.post('/api/admin/games').json({
      name: 'Test Game for Guide Image',
      description: 'A game for testing guide image uploads',
      releaseDate: '2024-01-01T00:00:00.000Z',
      genreId: genreId,
      isPopular: false,
    })
    const gameId = gameResponse.body().data.id

    const difficultyResponse = await client.post('/api/admin/difficulty-levels').json({
      name: 'Test Difficulty for Guide',
      description: 'Difficulty for testing guide uploads',
      level: 1,
    })
    const difficultyId = difficultyResponse.body().data.id

    const guideTypeResponse = await client.post('/api/admin/guide-types').json({
      name: 'Test Guide Type for Image',
      description: 'Guide type for testing image uploads',
    })
    const guideTypeId = guideTypeResponse.body().data.id

    // Générer un fichier PNG fake en mémoire
    const { contents, mime, name } = await fileGenerator.generatePng('120kb')

    const response = await client
      .post('/api/admin/guides')
      .field('title', 'Guide with Image Upload Test')
      .field(
        'summary',
        'This is a test guide with image upload functionality and it has enough characters to meet the minimum requirements'
      )
      .field('author', 'Test Author')
      .field('publishedAt', '2024-01-01 00:00:00')
      .field('gameId', gameId.toString())
      .field('difficultyId', difficultyId.toString())
      .field('guideTypeId', guideTypeId.toString())
      .field('sections[0][title]', 'Test Section')
      .field('sections[0][content]', 'This is a test section with enough content')
      .field('sections[0][order]', '1')
      .file('image', contents, {
        filename: name,
        contentType: mime,
      })

    // Vérifier le statut
    if (response.status() !== 201) {
      console.log('Error response:', response.body())
    }
    response.assertStatus(201)

    // Vérifier l'image
    const responseData = response.body().data
    assert.exists(responseData.image)
    assert.isString(responseData.image.url)
    assert.isTrue(responseData.image.url.includes('/uploads/'))

    // Vérifier que le fichier existe dans le fake drive
    fakeDisk.assertExists(`images/${responseData.image.filename}`)
  })

  test('should validate guide image file requirements', async ({ client }) => {
    // Créer les données de test nécessaires
    const genreResponse = await client.post('/api/admin/genres').json({
      name: 'Test Genre for Guide Validation',
      description: 'Genre for testing guide validation',
    })
    const genreId = genreResponse.body().data.id

    const gameResponse = await client.post('/api/admin/games').json({
      name: 'Test Game for Guide Validation',
      description: 'A game for testing guide validation',
      releaseDate: '2024-01-01T00:00:00.000Z',
      genreId: genreId,
      isPopular: false,
    })
    const gameId = gameResponse.body().data.id

    const difficultyResponse = await client.post('/api/admin/difficulty-levels').json({
      name: 'Test Difficulty for Validation',
      description: 'Difficulty for testing validation',
      level: 1,
    })
    const difficultyId = difficultyResponse.body().data.id

    const guideTypeResponse = await client.post('/api/admin/guide-types').json({
      name: 'Test Guide Type for Validation',
      description: 'Guide type for testing validation',
    })
    const guideTypeId = guideTypeResponse.body().data.id

    // Créer un fichier trop gros (> 2MB)
    const {
      contents: largeContents,
      mime: largeMime,
      name: largeName,
    } = await fileGenerator.generateJpg('3mb')

    const response = await client
      .post('/api/admin/guides')
      .field('title', 'Guide with Large Image Test')
      .field(
        'summary',
        'This should fail due to large image size but has enough characters to meet requirements'
      )
      .field('author', 'Test Author')
      .field('publishedAt', '2024-01-01 00:00:00')
      .field('gameId', gameId.toString())
      .field('difficultyId', difficultyId.toString())
      .field('guideTypeId', guideTypeId.toString())
      .field('sections[0][title]', 'Test Section')
      .field('sections[0][content]', 'This is a test section with enough content')
      .field('sections[0][order]', '1')
      .file('image', largeContents, {
        filename: largeName,
        contentType: largeMime,
      })

    // Devrait échouer à cause de la validation de taille
    response.assertStatus(422)
  })
})
