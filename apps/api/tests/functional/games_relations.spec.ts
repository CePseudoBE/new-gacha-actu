import { test } from '@japa/runner'

test.group('Games Relations Many-to-Many', () => {
  async function createTestData(client: any) {
    const timestamp = Math.floor(Math.random() * 10000)
    const genreResponse = await client.post('/api/admin/genres').json({
      name: `Gacha RPG ${timestamp}`,
      description: 'Role-playing games with gacha mechanics',
    })
    const genreId = genreResponse.body().data.id
    const iosResponse = await client.post('/api/admin/platforms').json({
      name: `iOS Test ${timestamp}`,
    })
    const androidResponse = await client.post('/api/admin/platforms').json({
      name: `Android Test ${timestamp}`,
    })
    const platformIds = [iosResponse.body().data.id, androidResponse.body().data.id]
    const animeTagResponse = await client.post('/api/admin/tags').json({
      name: `Anime Test ${timestamp}`,
    })
    const pvpTagResponse = await client.post('/api/admin/tags').json({
      name: `PvP Test ${timestamp}`,
    })
    const tagIds = [animeTagResponse.body().data.id, pvpTagResponse.body().data.id]
    return { genreId, platformIds, tagIds }
  }

  test('should create game with genre, platforms and tags relations', async ({ client, assert }) => {
    const { genreId, platformIds, tagIds } = await createTestData(client)
    const gameData = {
      name: 'Genshin Impact',
      description: 'Open-world action RPG with gacha system',
      developer: 'miHoYo',
      releaseDate: '2020-09-28',
      genreId: genreId,
      platformIds: platformIds,
      tagIds: tagIds,
    }
    const response = await client.post('/api/admin/games').json(gameData)
    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Jeu créé avec succès',
    })
    const game = response.body().data
    assert.exists(game.id)
    assert.equal(game.name, gameData.name)
    assert.exists(game.genres)
    assert.isArray(game.genres)
    assert.equal(game.genres[0].id, genreId)
  })

  test('should get game with relations', async ({ client, assert }) => {
    const { genreId, platformIds, tagIds } = await createTestData(client)
    const gameData = {
      name: 'Honkai Star Rail',
      description: 'Turn-based RPG in space',
      developer: 'miHoYo',
      releaseDate: '2023-04-26',
      genreId: genreId,
      platformIds: [platformIds[0]], 
      tagIds: [tagIds[1]], 
    }
    const createResponse = await client.post('/api/admin/games').json(gameData)
    createResponse.assertStatus(201)
    const createdGame = createResponse.body().data
    assert.exists(createdGame.slug)
    const gameSlug = createdGame.slug
    const response = await client.get(`/api/games/${gameSlug}`)
    response.assertStatus(200)
    const game = response.body().data
    assert.equal(game.name, gameData.name)
    assert.exists(game.genres)
    assert.isArray(game.genres)
    assert.equal(game.genres[0].id, genreId)
  })

  test('should update game relations', async ({ client, assert }) => {
    const { genreId, platformIds, tagIds } = await createTestData(client)
    const createResponse = await client.post('/api/admin/games').json({
      name: 'Blue Archive',
      description: 'School-themed RPG',
      developer: 'Nexon',
      releaseDate: '2021-02-04',
      genreId: genreId,
      platformIds: [platformIds[0]], 
      tagIds: [tagIds[0]], 
    })
    createResponse.assertStatus(201)
    const gameId = createResponse.body().data.id
    const updateData = {
      name: 'Blue Archive Global',
      platformIds: platformIds, 
      tagIds: tagIds, 
    }
    const response = await client.put(`/api/admin/games/${gameId}`).json(updateData)
    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Jeu mis à jour avec succès',
    })
    assert.equal(response.body().data.name, updateData.name)
  })

  test('should handle empty relations gracefully', async ({ client, assert }) => {
    const { genreId } = await createTestData(client)
    const gameData = {
      name: 'Solo Game',
      description: 'A game with no special relations',
      developer: 'Indie Dev',
      releaseDate: '2023-01-01',
      genreId: genreId,
    }
    const response = await client.post('/api/admin/games').json(gameData)
    response.assertStatus(201)
    assert.equal(response.body().data.name, gameData.name)
  })

  test('should fail with invalid genre id', async ({ client }) => {
    const { platformIds, tagIds } = await createTestData(client)
    const gameData = {
      name: 'Invalid Game',
      description: 'This should fail',
      developer: 'Nobody',
      releaseDate: '2023-01-01',
      genreId: 99999, 
      platformIds: platformIds,
      tagIds: tagIds,
    }
    const response = await client.post('/api/admin/games').json(gameData)
    response.assertStatus(422)
  })

  test('should fail with invalid platform ids', async ({ client }) => {
    const { genreId, tagIds } = await createTestData(client)
    const gameData = {
      name: 'Invalid Game 2',
      description: 'This should also fail',
      developer: 'Nobody',
      releaseDate: '2023-01-01',
      genreId: genreId,
      platformIds: [99999], 
      tagIds: tagIds,
    }
    const response = await client.post('/api/admin/games').json(gameData)
    response.assertStatus(422)
  })

  test('should get platforms with games', async ({ client, assert }) => {
    const { genreId, platformIds } = await createTestData(client)
    await client.post('/api/admin/games').json({
      name: 'Test Game for Platform',
      description: 'Testing platform relations',
      developer: 'Test Dev',
      releaseDate: '2023-01-01',
      genreId: genreId,
      platformIds: [platformIds[0]], 
    })
    const response = await client.get('/api/platforms')
    response.assertStatus(200)
    const platforms = response.body().data
    assert.isArray(platforms)
    assert.isAtLeast(platforms.length, 1)
  })

  test('should get tags with games', async ({ client, assert }) => {
    const { genreId, tagIds } = await createTestData(client)
    await client.post('/api/admin/games').json({
      name: 'Test Game for Tags',
      description: 'Testing tag relations',
      developer: 'Test Dev',
      releaseDate: '2023-01-01',
      genreId: genreId,
      tagIds: [tagIds[0]], 
    })
    const response = await client.get('/api/tags')
    response.assertStatus(200)
    const tags = response.body().data
    assert.isArray(tags)
    assert.isAtLeast(tags.length, 1)
  })
})