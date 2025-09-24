import { test } from '@japa/runner'

test.group('Genres CRUD API', () => {
  let createdGenreId: number

  test('POST /api/admin/genres should create a new genre', async ({ client }) => {
    const genreData = {
      name: 'Action RPG',
      description: 'Action role-playing games combine real-time action with character development'
    }

    const response = await client.post('/api/admin/genres').json(genreData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Genre créé avec succès'
    })

    const body = response.body()
    createdGenreId = body.data.id
    response.assertBodyContains({
      data: {
        name: 'Action RPG',
        description: genreData.description,
        slug: 'action-rpg'
      }
    })
  })

  test('GET /api/genres/:id should return the created genre', async ({ client }) => {
    const response = await client.get(`/api/genres/${createdGenreId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      data: {
        id: createdGenreId,
        name: 'Action RPG',
        slug: 'action-rpg'
      }
    })
  })

  test('GET /api/genres should return paginated genres including created one', async ({ client }) => {
    const response = await client.get('/api/genres')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      meta: {
        pagination: {}
      }
    })

    const body = response.body()
    response.assertBodyContains({
      data: [
        {
          name: 'Action RPG'
        }
      ]
    })
  })

  test('GET /api/genres with search should find the genre', async ({ client }) => {
    const response = await client.get('/api/genres?search=Action')

    response.assertStatus(200)
    const body = response.body()
    response.assertBodyContains({
      success: true,
      data: [
        {
          name: 'Action RPG'
        }
      ]
    })
  })

  test('GET /api/admin/genres/all should return all genres', async ({ client }) => {
    const response = await client.get('/api/admin/genres/all')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      data: [
        {
          name: 'Action RPG'
        }
      ]
    })
  })

  test('PUT /api/admin/genres/:id should update the genre', async ({ client }) => {
    const updateData = {
      name: 'Action RPG Updated',
      description: 'Updated description for action RPG games'
    }

    const response = await client.put(`/api/admin/genres/${createdGenreId}`).json(updateData)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Genre mis à jour avec succès',
      data: {
        id: createdGenreId,
        name: 'Action RPG Updated',
        slug: 'action-rpg', 
        description: updateData.description
      }
    })
  })

  test('GET /api/genres/:id should return updated genre', async ({ client }) => {
    const response = await client.get(`/api/genres/${createdGenreId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        name: 'Action RPG Updated'
      }
    })
  })

  test('DELETE /api/admin/genres/:id should delete the genre', async ({ client }) => {
    const response = await client.delete(`/api/admin/genres/${createdGenreId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Genre supprimé avec succès'
    })
  })

  test('GET /api/genres/:id should return 404 for deleted genre', async ({ client }) => {
    const response = await client.get(`/api/genres/${createdGenreId}`)

    response.assertStatus(404)
  })

  test('GET /api/genres should return empty list after deletion', async ({ client }) => {
    const response = await client.get('/api/genres')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      data: []
    })
  })
})