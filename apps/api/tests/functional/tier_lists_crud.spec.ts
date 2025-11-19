import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'

test.group('Tier Lists CRUD', (group) => {
  let createdGameId: number
  let createdCharacter1Id: number
  let createdCharacter2Id: number
  let createdCharacter3Id: number
  let createdTierListId: number

  group.setup(async () => {
    const now = new Date()
    await db.table('tiers').multiInsert([
      { name: 'S', label: 'God Tier', color: '#FF6B6B', order: 1, description: 'Best characters', created_at: now, updated_at: now },
      { name: 'A', label: 'Excellent', color: '#FFA94D', order: 2, description: 'Excellent characters', created_at: now, updated_at: now },
      { name: 'B', label: 'Good', color: '#FFD43B', order: 3, description: 'Good characters', created_at: now, updated_at: now },
      { name: 'C', label: 'Average', color: '#74C0FC', order: 4, description: 'Average characters', created_at: now, updated_at: now },
      { name: 'D', label: 'Below Average', color: '#B197FC', order: 5, description: 'Below average characters', created_at: now, updated_at: now },
      { name: 'F', label: 'Poor', color: '#E599F7', order: 6, description: 'Poor characters', created_at: now, updated_at: now },
    ])
  })

  test('setup: create game for tier lists', async ({ client }) => {
    const genreResponse = await client.post('/api/admin/genres').json({
      name: 'Test Genre for Tier Lists',
      description: 'Genre for testing tier lists',
    })
    const genreId = genreResponse.body().data.id

    const gameData = {
      name: 'Test Game for Tier Lists',
      description: 'A game for testing tier lists',
      developer: 'Test Studio',
      releaseDate: '2024-01-01',
      genreId: genreId,
      isPopular: false,
    }

    const response = await client.post('/api/admin/games').json(gameData)
    createdGameId = response.body().data.id
  })

  test('setup: create characters for tier list', async ({ client }) => {
    const character1 = await client.post('/api/admin/characters').json({
      gameId: createdGameId,
      name: 'Character S Tier',
      rarity: 'SSR',
      element: 'Fire',
      role: 'DPS',
      isLimited: true,
    })
    createdCharacter1Id = character1.body().data.id

    const character2 = await client.post('/api/admin/characters').json({
      gameId: createdGameId,
      name: 'Character A Tier',
      rarity: 'SR',
      element: 'Water',
      role: 'Support',
      isLimited: false,
    })
    createdCharacter2Id = character2.body().data.id

    const character3 = await client.post('/api/admin/characters').json({
      gameId: createdGameId,
      name: 'Character B Tier',
      rarity: 'R',
      element: 'Earth',
      role: 'Tank',
      isLimited: false,
    })
    createdCharacter3Id = character3.body().data.id
  })

  test('should create a complete tier list with categories and entries', async ({
    client,
    assert,
  }) => {
    const tierListData = {
      gameId: createdGameId,
      title: 'Complete Tier List for Testing',
      description: 'A complete tier list with all features',
      version: '1.0',
      isPublished: false,
      categories: [
        {
          name: 'PvP',
          description: 'Player vs Player ranking',
          icon: 'sword',
          order: 1,
        },
        {
          name: 'PvE',
          description: 'Player vs Environment ranking',
          icon: 'shield',
          order: 2,
        },
      ],
      entries: [
        {
          characterId: createdCharacter1Id,
          tierId: 1,
          notes: 'Best character in the game',
          order: 1,
        },
        {
          characterId: createdCharacter2Id,
          tierId: 2,
          notes: 'Very good support',
          order: 2,
        },
        {
          characterId: createdCharacter3Id,
          tierId: 3,
          notes: 'Decent tank',
          order: 3,
        },
      ],
    }

    const response = await client.post('/api/admin/tier-lists').json(tierListData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Tier list créée avec succès',
    })

    createdTierListId = response.body().data.id
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.title, tierListData.title)
    assert.equal(response.body().data.gameId, createdGameId)
    assert.equal(response.body().data.isPublished, false)
    assert.exists(response.body().data.game)
    assert.exists(response.body().data.author)
    assert.isArray(response.body().data.categories)
    assert.isArray(response.body().data.entries)
    assert.lengthOf(response.body().data.categories, 2)
    assert.lengthOf(response.body().data.entries, 3)
  })

  test('should get tier list by id with all relations', async ({ client, assert }) => {
    const response = await client.get(`/api/tier-lists/${createdTierListId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    const data = response.body().data
    assert.equal(data.id, createdTierListId)
    assert.equal(data.title, 'Complete Tier List for Testing')
    assert.exists(data.game)
    assert.equal(data.game.id, createdGameId)
    assert.exists(data.author)
    assert.isArray(data.categories)
    assert.isArray(data.entries)
  })

  test('should get tier list by slug after publish', async ({ client, assert }) => {
    await client.patch(`/api/admin/tier-lists/${createdTierListId}/publish`)

    const tierListResponse = await client.get(`/api/tier-lists/${createdTierListId}`)
    const slug = tierListResponse.body().data.slug

    const response = await client.get(`/api/tier-lists/slug/${slug}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.equal(response.body().data.id, createdTierListId)
    assert.equal(response.body().data.slug, slug)

    await client.patch(`/api/admin/tier-lists/${createdTierListId}/unpublish`)
  })

  test('should get tier lists by game when published', async ({ client, assert }) => {
    await client.patch(`/api/admin/tier-lists/${createdTierListId}/publish`)

    const response = await client.get(`/api/tier-lists/game/${createdGameId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.isArray(response.body().data)
    assert.isAtLeast(response.body().data.length, 1)

    await client.patch(`/api/admin/tier-lists/${createdTierListId}/unpublish`)
  })

  test('should publish tier list', async ({ client, assert }) => {
    const response = await client.patch(`/api/admin/tier-lists/${createdTierListId}/publish`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Tier list publiée avec succès',
    })

    assert.equal(response.body().data.isPublished, true)
  })

  test('should get published tier lists', async ({ client, assert }) => {
    const response = await client.get('/api/tier-lists?isPublished=true')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.isArray(response.body().data)
  })

  test('should unpublish tier list', async ({ client, assert }) => {
    const response = await client.patch(`/api/admin/tier-lists/${createdTierListId}/unpublish`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Tier list dépubliée avec succès',
    })

    assert.equal(response.body().data.isPublished, false)
  })

  test('should update tier list', async ({ client }) => {
    const updateData = {
      title: 'Updated Tier List Title',
      description: 'Updated description',
      version: '2.0',
    }

    const response = await client.put(`/api/admin/tier-lists/${createdTierListId}`).json(updateData)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Tier list mise à jour avec succès',
      data: {
        id: createdTierListId,
        title: updateData.title,
        description: updateData.description,
        version: updateData.version,
      },
    })
  })

  test('should get tier list categories', async ({ client, assert }) => {
    const response = await client.get(`/api/admin/tier-lists/${createdTierListId}/categories`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 2)
  })

  test('should get tier list entries', async ({ client, assert }) => {
    const response = await client.get(`/api/admin/tier-lists/${createdTierListId}/entries`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
    })

    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 3)
  })

  test('should bulk update entries', async ({ client }) => {
    const entriesResponse = await client.get(`/api/admin/tier-lists/${createdTierListId}/entries`)
    const entries = entriesResponse.body().data

    const bulkUpdateData = {
      entries: [
        {
          id: entries[0].id,
          tierId: 2,
          order: 10,
        },
        {
          id: entries[1].id,
          tierId: 1,
          order: 20,
        },
      ],
    }

    const response = await client
      .post('/api/admin/tier-lists/entries/bulk-update')
      .json(bulkUpdateData)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Entrées mises à jour avec succès',
    })
  })

  test('should delete tier list', async ({ client }) => {
    const response = await client.delete(`/api/admin/tier-lists/${createdTierListId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Tier list supprimée avec succès',
    })
  })

  test('should return 404 for deleted tier list', async ({ client }) => {
    const response = await client.get(`/api/tier-lists/${createdTierListId}`)

    response.assertStatus(404)
  })
})
