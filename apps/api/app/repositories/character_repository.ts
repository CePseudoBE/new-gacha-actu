import Character from '#models/character'
import { DateTime } from 'luxon'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export interface CharacterFilters {
  gameId?: number
  rarity?: string
  element?: string
  role?: string
  isLimited?: boolean
  search?: string
}

export interface CharacterCreateData {
  gameId: number
  name: string
  rarity?: string | null
  element?: string | null
  role?: string | null
  imageId?: number
  description?: string | null
  releaseDate?: DateTime | null
  isLimited?: boolean
}

export interface CharacterUpdateData extends Partial<CharacterCreateData> {}

export default class CharacterRepository {
  async findMany(
    filters: CharacterFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<ModelPaginatorContract<Character>> {
    const query = Character.query()

    if (filters.gameId) {
      query.where('gameId', filters.gameId)
    }

    if (filters.rarity) {
      query.where('rarity', filters.rarity)
    }

    if (filters.element) {
      query.where('element', filters.element)
    }

    if (filters.role) {
      query.where('role', filters.role)
    }

    if (filters.isLimited !== undefined) {
      query.where('isLimited', filters.isLimited)
    }

    if (filters.search) {
      query.where((builder) => {
        builder
          .where('name', 'ILIKE', `%${filters.search}%`)
          .orWhere('description', 'ILIKE', `%${filters.search}%`)
      })
    }

    query.preload('image').preload('game').orderBy('name', 'asc')

    return query.paginate(page, perPage)
  }

  async findById(id: number): Promise<Character | null> {
    return Character.query().where('id', id).preload('image').preload('game').first()
  }

  async findBySlug(slug: string): Promise<Character | null> {
    return Character.query().where('slug', slug).preload('image').preload('game').first()
  }

  async findByGameId(gameId: number, limit: number = 100): Promise<Character[]> {
    return Character.query()
      .where('gameId', gameId)
      .preload('image')
      .orderBy('name', 'asc')
      .limit(limit)
  }

  async create(data: CharacterCreateData): Promise<Character> {
    return await Character.create({
      gameId: data.gameId,
      name: data.name,
      rarity: data.rarity,
      element: data.element,
      role: data.role,
      imageId: data.imageId,
      description: data.description,
      releaseDate: data.releaseDate,
      isLimited: data.isLimited || false,
    })
  }

  async update(id: number, data: CharacterUpdateData): Promise<Character | null> {
    const character = await Character.find(id)
    if (!character) return null

    const updateData = Object.fromEntries(
      Object.entries({
        gameId: data.gameId,
        name: data.name,
        rarity: data.rarity,
        element: data.element,
        role: data.role,
        imageId: data.imageId,
        description: data.description,
        releaseDate: data.releaseDate,
        isLimited: data.isLimited,
      }).filter(([, value]) => value !== undefined)
    )

    character.merge(updateData)
    await character.save()

    return character
  }

  async delete(id: number): Promise<boolean> {
    const character = await Character.find(id)
    if (!character) return false

    await character.delete()
    return true
  }

  async count(): Promise<number> {
    const result = await Character.query().count('* as total')
    return Number(result[0].$extras.total)
  }

  async countByGameId(gameId: number): Promise<number> {
    const result = await Character.query().where('gameId', gameId).count('* as total')
    return Number(result[0].$extras.total)
  }
}
