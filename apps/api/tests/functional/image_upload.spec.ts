import { test } from '@japa/runner'
import drive from '@adonisjs/drive/services/main'
import { writeFileSync, unlinkSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

test.group('Image Upload', (group) => {
  group.setup(async () => {
    // Fake the drive during tests
    drive.fake()
  })

  group.teardown(async () => {
    // Restore the real drive
    drive.restore()
  })

  test('should create article with image upload', async ({ client, assert }) => {
    // Créer les données de test directement
    const genreResponse = await client.post('/api/admin/genres').json({
      name: 'Test Genre for Image Upload',
      description: 'Genre for testing image uploads',
    })
    const genreId = genreResponse.body().data.id

    const gameData = {
      name: 'Test Game for Image Upload',
      description: 'A game for testing image uploads',
      releaseDate: '2024-01-01T00:00:00.000Z',
      genreId: genreId,
      isPopular: false,
    }

    const gameResponse = await client.post('/api/admin/games').json(gameData)
    const gameId = gameResponse.body().data.id

    const categoryData = {
      name: 'Test Category for Image Upload',
      description: 'Category for testing image uploads',
    }

    const categoryResponse = await client.post('/api/admin/article-categories').json(categoryData)
    const categoryId = categoryResponse.body().data.id

    // Créer un fichier temporaire avec vraie extension
    const tempFile = join(process.cwd(), 'tmp', 'test-image.jpg')
    const jpegHeader = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46])
    const jpegFooter = Buffer.from([0xFF, 0xD9])
    const fakeImageData = Buffer.concat([jpegHeader, Buffer.from('fake-image-content'), jpegFooter])
    writeFileSync(tempFile, fakeImageData)

    const articleData = {
      title: 'Article with Image Upload Test',
      summary: 'This is a test article with image upload functionality',
      author: 'Test Author',
      publishedAt: '2024-01-01 00:00:00',
      content: 'This is the content of the test article with image upload. It contains enough text to meet the minimum requirements.',
      gameId: gameId,
      categoryId: categoryId,
    }

    const response = await client
      .post('/api/admin/articles')
      .field('title', articleData.title)
      .field('summary', articleData.summary)
      .field('author', articleData.author)
      .field('publishedAt', articleData.publishedAt)
      .field('content', articleData.content)
      .field('gameId', articleData.gameId.toString())
      .field('categoryId', articleData.categoryId.toString())
      .file('image', readFileSync(tempFile), {
        filename: 'test-image.jpg',
        contentType: 'image/jpeg'
      })

    // Nettoyer le fichier temporaire
    try {
      unlinkSync(tempFile)
    } catch (error) {
      // Ignorer si le fichier n'existe pas
    }

    if (response.status() !== 201) {
      console.log('Response body:', response.body())
    }
    response.assertStatus(201)
    assert.exists(response.body().data)
    assert.exists(response.body().data.image)
    assert.isTrue(response.body().data.image.url.includes('/uploads/'))

    // Vérifier que le fichier a été créé dans le fake drive
    const fakeDisk = drive.use()
    await fakeDisk.assertExists(`images/${response.body().data.image.filename}`)
  })

  test('should update article with new image', async ({ client, assert }) => {
    // Créer les données de test
    const genreResponse = await client.post('/api/admin/genres').json({
      name: 'Test Genre for Update',
      description: 'Genre for testing updates',
    })
    const genreId = genreResponse.body().data.id

    const gameResponse = await client.post('/api/admin/games').json({
      name: 'Test Game for Update',
      description: 'A game for testing updates',
      releaseDate: '2024-01-01T00:00:00.000Z',
      genreId: genreId,
      isPopular: false,
    })
    const gameId = gameResponse.body().data.id

    const categoryResponse = await client.post('/api/admin/article-categories').json({
      name: 'Test Category for Update',
      description: 'Category for testing updates',
    })
    const categoryId = categoryResponse.body().data.id

    // D'abord créer un article sans image
    const articleData = {
      title: 'Article for Update Image Test',
      summary: 'This is a test article for update with image',
      author: 'Test Author',
      publishedAt: '2024-01-01 00:00:00',
      content: 'This is the content of the test article for update. It contains enough text to meet the minimum requirements.',
      gameId: gameId,
      categoryId: categoryId,
    }

    const createResponse = await client.post('/api/admin/articles').json(articleData)
    const articleId = createResponse.body().data.id

    // Maintenant update avec une image
    const tempFile2 = join(process.cwd(), 'tmp', 'test-update.png')
    // Créer un PNG minimal (header PNG valide)
    const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
    const pngEnd = Buffer.from([0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82])
    const fakeImageData2 = Buffer.concat([pngHeader, Buffer.from('fake-png-content'), pngEnd])
    writeFileSync(tempFile2, fakeImageData2)

    const updateData = {
      title: 'Updated Article with Image',
    }

    const updateResponse = await client
      .put(`/api/admin/articles/${articleId}`)
      .field('title', updateData.title)
      .file('image', readFileSync(tempFile2), {
        filename: 'test-update.png',
        contentType: 'image/png'
      })

    // Nettoyer le fichier temporaire
    try {
      unlinkSync(tempFile2)
    } catch (error) {
      // Ignorer si le fichier n'existe pas
    }

    updateResponse.assertStatus(200)
    assert.exists(updateResponse.body().data.image)
    assert.isTrue(updateResponse.body().data.image.url.includes('/uploads/'))

    // Vérifier que le fichier a été créé dans le fake drive
    const fakeDisk = drive.use()
    await fakeDisk.assertExists(`images/${updateResponse.body().data.image.filename}`)
  })

  test('should validate image file requirements', async ({ client }) => {
    // Créer les données de test
    const genreResponse = await client.post('/api/admin/genres').json({
      name: 'Test Genre for Validation',
      description: 'Genre for testing validation',
    })
    const genreId = genreResponse.body().data.id

    const gameResponse = await client.post('/api/admin/games').json({
      name: 'Test Game for Validation',
      description: 'A game for testing validation',
      releaseDate: '2024-01-01T00:00:00.000Z',
      genreId: genreId,
      isPopular: false,
    })
    const gameId = gameResponse.body().data.id

    const categoryResponse = await client.post('/api/admin/article-categories').json({
      name: 'Test Category for Validation',
      description: 'Category for testing validation',
    })
    const categoryId = categoryResponse.body().data.id

    // Créer un fichier trop gros (> 2MB)
    const tempLargeFile = join(process.cwd(), 'tmp', 'large-image.jpg')
    const jpegHeader = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46])
    const jpegFooter = Buffer.from([0xFF, 0xD9])
    const largeContent = Buffer.alloc(3 * 1024 * 1024, 'x') // 3MB
    const largeFakeImageData = Buffer.concat([jpegHeader, largeContent, jpegFooter])
    writeFileSync(tempLargeFile, largeFakeImageData)

    const articleData = {
      title: 'Article with Large Image Test',
      summary: 'This should fail due to large image size',
      author: 'Test Author',
      publishedAt: '2024-01-01 00:00:00',
      content: 'This is the content of the test article with large image. It contains enough text to meet the minimum requirements.',
      gameId: gameId,
      categoryId: categoryId,
    }

    const response = await client
      .post('/api/admin/articles')
      .field('title', articleData.title)
      .field('summary', articleData.summary)
      .field('author', articleData.author)
      .field('publishedAt', articleData.publishedAt)
      .field('content', articleData.content)
      .field('gameId', articleData.gameId.toString())
      .field('categoryId', articleData.categoryId.toString())
      .file('image', readFileSync(tempLargeFile), {
        filename: 'large-image.jpg',
        contentType: 'image/jpeg'
      })

    // Nettoyer le fichier temporaire
    try {
      unlinkSync(tempLargeFile)
    } catch (error) {
      // Ignorer si le fichier n'existe pas
    }

    // Devrait échouer à cause de la validation de taille
    response.assertStatus(422)
  })

  test('should delete image via images endpoint', async ({ client, assert }) => {
    // Créer les données de test
    const genreResponse = await client.post('/api/admin/genres').json({
      name: 'Test Genre for Deletion',
      description: 'Genre for testing deletion',
    })
    const genreId = genreResponse.body().data.id

    const gameResponse = await client.post('/api/admin/games').json({
      name: 'Test Game for Deletion',
      description: 'A game for testing deletion',
      releaseDate: '2024-01-01T00:00:00.000Z',
      genreId: genreId,
      isPopular: false,
    })
    const gameId = gameResponse.body().data.id

    const categoryResponse = await client.post('/api/admin/article-categories').json({
      name: 'Test Category for Deletion',
      description: 'Category for testing deletion',
    })
    const categoryId = categoryResponse.body().data.id

    // Créer un article avec image
    const tempFile3 = join(process.cwd(), 'tmp', 'delete-test.jpg')
    const jpegHeader = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46])
    const jpegFooter = Buffer.from([0xFF, 0xD9])
    const fakeImageData3 = Buffer.concat([jpegHeader, Buffer.from('fake-image-for-deletion'), jpegFooter])
    writeFileSync(tempFile3, fakeImageData3)

    const articleData = {
      title: 'Article for Image Deletion Test',
      summary: 'This is a test article for image deletion',
      author: 'Test Author',
      publishedAt: '2024-01-01 00:00:00',
      content: 'This is the content of the test article for image deletion. It contains enough text to meet the minimum requirements.',
      gameId: gameId,
      categoryId: categoryId,
    }

    const createResponse = await client
      .post('/api/admin/articles')
      .field('title', articleData.title)
      .field('summary', articleData.summary)
      .field('author', articleData.author)
      .field('publishedAt', articleData.publishedAt)
      .field('content', articleData.content)
      .field('gameId', articleData.gameId.toString())
      .field('categoryId', articleData.categoryId.toString())
      .file('image', readFileSync(tempFile3), {
        filename: 'delete-test.jpg',
        contentType: 'image/jpeg'
      })

    // Nettoyer le fichier temporaire
    try {
      unlinkSync(tempFile3)
    } catch (error) {
      // Ignorer si le fichier n'existe pas
    }

    const imageId = createResponse.body().data.image.id
    const imagePath = `images/${createResponse.body().data.image.filename}`

    // Vérifier que l'image existe
    const fakeDisk = drive.use()
    await fakeDisk.assertExists(imagePath)

    // Supprimer l'image
    const deleteResponse = await client.delete(`/api/admin/images/${imageId}`)
    deleteResponse.assertStatus(200)

    // Vérifier que l'image a été supprimée du fake drive
    await fakeDisk.assertMissing(imagePath)
  })
})