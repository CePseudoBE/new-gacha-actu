import { test } from '@japa/runner'
import drive from '@adonisjs/drive/services/main'
import { writeFileSync, unlinkSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

test.group('Simple Image Upload Test', (group) => {
  group.setup(async () => {
    // Fake the drive during tests
    drive.fake()
  })

  group.teardown(async () => {
    // Restore the real drive
    drive.restore()
  })

  test('should upload image with article creation', async ({ client, assert }) => {
    // Créer genre
    const genreResponse = await client.post('/api/admin/genres').json({
      name: 'Test Genre Upload',
      description: 'Genre for upload test',
    })
    const genreId = genreResponse.body().data.id

    // Créer game
    const gameResponse = await client.post('/api/admin/games').json({
      name: 'Test Game Upload',
      description: 'Game for upload test',
      releaseDate: '2024-01-01T00:00:00.000Z',
      genreId: genreId,
      isPopular: false,
    })
    const gameId = gameResponse.body().data.id

    // Créer category
    const categoryResponse = await client.post('/api/admin/article-categories').json({
      name: 'Test Category Upload',
      description: 'Category for upload test',
    })
    const categoryId = categoryResponse.body().data.id

    // Créer un fichier temporaire avec vraie extension et content-type
    const tempFile = join(process.cwd(), 'tmp', 'test-image.jpg')
    // Créer un vrai JPEG minimal (header JPEG valide)
    const jpegHeader = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46])
    const jpegFooter = Buffer.from([0xFF, 0xD9])
    const fakeImageData = Buffer.concat([jpegHeader, Buffer.from('fake-image-content'), jpegFooter])
    writeFileSync(tempFile, fakeImageData)

    // Créer article avec image
    const response = await client
      .post('/api/admin/articles')
      .field('title', 'Article with Image Upload Test')
      .field('summary', 'This is a test article with image upload functionality')
      .field('author', 'Test Author')
      .field('publishedAt', '2024-01-01 00:00:00')
      .field('content', 'This is the content of the test article with image upload. It contains enough text to meet the minimum requirements.')
      .field('gameId', gameId.toString())
      .field('categoryId', categoryId.toString())
      .file('image', readFileSync(tempFile), {
        filename: 'test-image.jpg',
        contentType: 'image/jpeg'
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
    const fakeDisk = drive.use()
    await fakeDisk.assertExists(`images/${responseData.image.filename}`)

    // Nettoyer le fichier temporaire
    try {
      unlinkSync(tempFile)
    } catch (error) {
      // Ignorer si le fichier n'existe pas
    }
  })
})