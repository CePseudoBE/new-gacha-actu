import { test } from '@japa/runner'
import drive from '@adonisjs/drive/services/main'
import fileGenerator from '@poppinss/file-generator'

test.group('Game Image Upload', (group) => {
  let fakeDisk: any

  group.setup(async () => {
    // Fake the drive during tests
    fakeDisk = drive.fake()
  })

  group.teardown(async () => {
    // Restore the real drive
    drive.restore()
  })

  test('should create game with image upload', async ({ client, assert }) => {
    // Créer genre pour le game
    const genreResponse = await client.post('/api/admin/genres').json({
      name: 'Test Genre for Game Image',
      description: 'Genre for testing game image uploads',
    })
    const genreId = genreResponse.body().data.id

    // Générer un fichier PNG fake en mémoire
    const { contents, mime, name } = await fileGenerator.generatePng('150kb')

    const response = await client
      .post('/api/admin/games')
      .field('name', 'Game with Image Upload Test')
      .field('description', 'This is a test game with image upload functionality')
      .field('releaseDate', '2024-01-01T00:00:00.000Z')
      .field('genreId', genreId.toString())
      .field('isPopular', 'false')
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

  test('should update game with new image', async ({ client, assert }) => {
    // Créer genre
    const genreResponse = await client.post('/api/admin/genres').json({
      name: 'Test Genre for Game Update',
      description: 'Genre for testing game image updates',
    })
    const genreId = genreResponse.body().data.id

    // D'abord créer un game sans image
    const gameData = {
      name: 'Game for Update Image Test',
      description: 'This is a test game for update with image',
      releaseDate: '2024-01-01T00:00:00.000Z',
      genreId: genreId,
      isPopular: false,
    }

    const createResponse = await client.post('/api/admin/games').json(gameData)
    const gameId = createResponse.body().data.id

    // Maintenant update avec une image JPEG
    const {
      contents: jpegContents,
      mime: jpegMime,
      name: jpegName,
    } = await fileGenerator.generateJpg('200kb')

    const updateResponse = await client
      .put(`/api/admin/games/${gameId}`)
      .field('name', 'Updated Game with Image')
      .file('image', jpegContents, {
        filename: jpegName,
        contentType: jpegMime,
      })

    updateResponse.assertStatus(200)
    assert.exists(updateResponse.body().data.image)
    assert.isTrue(updateResponse.body().data.image.url.includes('/uploads/'))

    // Vérifier que le fichier a été créé dans le fake drive
    fakeDisk.assertExists(`images/${updateResponse.body().data.image.filename}`)
  })

  test('should validate game image file requirements', async ({ client }) => {
    // Créer genre
    const genreResponse = await client.post('/api/admin/genres').json({
      name: 'Test Genre for Game Validation',
      description: 'Genre for testing game image validation',
    })
    const genreId = genreResponse.body().data.id

    // Créer un fichier trop gros (> 2MB)
    const {
      contents: largeContents,
      mime: largeMime,
      name: largeName,
    } = await fileGenerator.generatePng('3mb')

    const response = await client
      .post('/api/admin/games')
      .field('name', 'Game with Large Image Test')
      .field('description', 'This should fail due to large image size')
      .field('releaseDate', '2024-01-01T00:00:00.000Z')
      .field('genreId', genreId.toString())
      .field('isPopular', 'false')
      .file('image', largeContents, {
        filename: largeName,
        contentType: largeMime,
      })

    // Devrait échouer à cause de la validation de taille
    response.assertStatus(422)
  })
})
