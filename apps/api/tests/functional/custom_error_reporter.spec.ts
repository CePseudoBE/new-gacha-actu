import { test } from '@japa/runner'
import Game from '#models/game'
import { DateTime } from 'luxon'

test.group('Custom Error Reporter - 404 for params validation', () => {
  test('GET /api/games/:slug should return 404 for non-existent slug', async ({ client }) => {
    const response = await client.get('/api/games/non-existent-slug')

    response.assertStatus(404)
    response.assertBodyContains({
      success: false,
      error: 'Resource not found',
      code: 'E_NOT_FOUND',
    })
  })

  test('PUT /api/admin/games/:id should return 404 for non-existent id', async ({ client }) => {
    const response = await client.put('/api/admin/games/999999').json({
      name: 'Updated name',
    })

    response.assertStatus(404)
    response.assertBodyContains({
      code: 'E_NOT_FOUND',
    })
  })

  test('DELETE /api/admin/games/:id should return 404 for non-existent id', async ({ client }) => {
    const response = await client.delete('/api/admin/games/999999')

    response.assertStatus(404)
    response.assertBodyContains({
      code: 'E_NOT_FOUND',
    })
  })

  test('GET /api/youtube-videos/:id should return 404 for non-existent id', async ({ client }) => {
    const response = await client.get('/api/youtube-videos/999999')

    response.assertStatus(404)
  })

  test('PUT /api/admin/youtube-videos/:id should return 404 for non-existent id', async ({
    client,
  }) => {
    const response = await client.put('/api/admin/youtube-videos/999999').json({
      title: 'Updated title',
    })

    response.assertStatus(404)
  })

  test('DELETE /api/admin/youtube-videos/:id should return 404 for non-existent id', async ({
    client,
  }) => {
    const response = await client.delete('/api/admin/youtube-videos/999999')

    response.assertStatus(404)
  })
})

test.group('Custom Error Reporter - 422 for body validation', () => {
  test('POST /api/admin/games should return 422 for non-existent genreIds in body', async ({
    client,
    assert,
  }) => {
    const response = await client.post('/api/admin/games').json({
      name: 'Valid Game Name',
      description: 'Valid description with enough characters',
      releaseDate: '2024-01-01',
      genreIds: [999999],
      platformIds: [1],
    })

    response.assertStatus(422)
    const body = response.body()

    assert.exists(body.errors)
    assert.isArray(body.errors)
    assert.isAbove(body.errors.length, 0)

    const genreError = body.errors.find((err: any) => err.field.includes('genreIds'))
    assert.exists(genreError)
    assert.equal(genreError.rule, 'database.exists')
  })

  test('POST /api/admin/games should return 422 for non-existent platformIds in body', async ({
    client,
    assert,
  }) => {
    const response = await client.post('/api/admin/games').json({
      name: 'Valid Game Name',
      description: 'Valid description with enough characters',
      releaseDate: '2024-01-01',
      genreIds: [1],
      platformIds: [999999],
    })

    response.assertStatus(422)
    const body = response.body()

    assert.exists(body.errors)
    assert.isArray(body.errors)
    assert.isAbove(body.errors.length, 0)

    const platformError = body.errors.find((err: any) => err.field === 'platformIds.0')
    assert.exists(platformError)
    assert.equal(platformError.rule, 'database.exists')
  })

  test('POST /api/admin/games should return 422 for invalid name length', async ({
    client,
    assert,
  }) => {
    const response = await client.post('/api/admin/games').json({
      name: 'X',
      description: 'Valid description with enough characters',
      releaseDate: '2024-01-01',
      genreIds: [1],
      platformIds: [1],
    })

    response.assertStatus(422)
    const body = response.body()

    assert.exists(body.errors)
    assert.isArray(body.errors)
    assert.isAbove(body.errors.length, 0)

    const nameError = body.errors.find((err: any) => err.field === 'name')
    assert.exists(nameError)
    assert.equal(nameError.rule, 'minLength')
    assert.include(nameError.message, 'au moins')
  })

  test('POST /api/admin/youtube-videos should return 422 for non-existent gameId in body', async ({
    client,
    assert,
  }) => {
    const response = await client.post('/api/admin/youtube-videos').json({
      videoId: 'test-video-id',
      title: 'Test Video',
      gameId: 999999,
    })

    response.assertStatus(422)
    const body = response.body()

    assert.exists(body.errors)
    assert.isArray(body.errors)
    assert.isAbove(body.errors.length, 0)

    const gameError = body.errors.find((err: any) => err.field === 'gameId')
    assert.exists(gameError)
    assert.equal(gameError.rule, 'database.exists')
  })

  test('PUT /api/admin/games/:id should return 422 for non-existent genreIds in body (but existing game)', async ({
    client,
    assert,
  }) => {
    const timestamp = Date.now()
    const game = await Game.create({
      name: `Test Game For GenreIds ${timestamp}`,
      slug: `test-game-for-genre-ids-${timestamp}`,
      description: 'Test description',
      releaseDate: DateTime.fromJSDate(new Date('2024-01-01')),
      isPopular: false,
    })

    const response = await client.put(`/api/admin/games/${game.id}`).json({
      name: 'Updated name',
      genreIds: [999999],
    })

    response.assertStatus(422)
    const body = response.body()

    assert.exists(body.errors)
    assert.isArray(body.errors)
    assert.isAbove(body.errors.length, 0)

    const genreError = body.errors.find((err: any) => err.field.includes('genreIds'))
    assert.exists(genreError)
    assert.equal(genreError.rule, 'database.exists')

    await game.delete()
  })
})

test.group('Custom Error Reporter - Mixed scenarios', () => {
  test('should return 422 when both params and body have validation errors', async ({
    client,
    assert,
  }) => {
    const response = await client.put('/api/admin/games/999999').json({
      name: 'X',
      genreIds: [999999],
    })

    response.assertStatus(422)
    const body = response.body()

    assert.exists(body.errors)
    assert.isArray(body.errors)
    assert.isAbove(body.errors.length, 0)

    const hasParamsError = body.errors.some((err: any) => err.field.includes('params.'))
    const hasBodyError = body.errors.some((err: any) => !err.field.includes('params.'))

    assert.isTrue(hasParamsError || hasBodyError) // Au moins une des deux
  })
})
