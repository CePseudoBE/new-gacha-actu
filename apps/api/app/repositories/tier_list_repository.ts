import TierList from '#models/tier_list'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export interface TierListFilters {
  gameId?: number
  isPublished?: boolean
  search?: string
}

export interface TierListCreateData {
  gameId: number
  title: string
  description?: string | null
  version?: string | null
  authorId: number
  imageId?: number
  isPublished?: boolean
}

export interface TierListUpdateData extends Partial<TierListCreateData> {}

export default class TierListRepository {
  async findMany(
    filters: TierListFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<ModelPaginatorContract<TierList>> {
    const query = TierList.query()

    if (filters.gameId) {
      query.where('gameId', filters.gameId)
    }

    if (filters.isPublished !== undefined) {
      query.where('isPublished', filters.isPublished)
    }

    if (filters.search) {
      query.where((builder) => {
        builder
          .where('title', 'ILIKE', `%${filters.search}%`)
          .orWhere('description', 'ILIKE', `%${filters.search}%`)
      })
    }

    query
      .preload('image')
      .preload('game')
      .preload('author')
      .orderBy([
        { column: 'is_published', order: 'desc' },
        { column: 'created_at', order: 'desc' },
      ])

    return query.paginate(page, perPage)
  }

  async findById(id: number): Promise<TierList | null> {
    return TierList.query()
      .where('id', id)
      .preload('image')
      .preload('game')
      .preload('author')
      .preload('categories', (categoryQuery) => {
        categoryQuery.orderBy('order', 'asc')
      })
      .preload('entries', (entryQuery) => {
        entryQuery
          .preload('character', (characterQuery) => {
            characterQuery.preload('image')
          })
          .preload('tier')
          .preload('category')
          .orderBy('order', 'asc')
      })
      .first()
  }

  async findBySlug(slug: string): Promise<TierList | null> {
    return TierList.query()
      .where('slug', slug)
      .where('isPublished', true)
      .preload('image')
      .preload('game')
      .preload('author')
      .preload('categories', (categoryQuery) => {
        categoryQuery.orderBy('order', 'asc')
      })
      .preload('entries', (entryQuery) => {
        entryQuery
          .preload('character', (characterQuery) => {
            characterQuery.preload('image')
          })
          .preload('tier')
          .preload('category')
          .orderBy('order', 'asc')
      })
      .first()
  }

  async findByGameId(gameId: number, limit: number = 10): Promise<TierList[]> {
    return TierList.query()
      .where('gameId', gameId)
      .where('isPublished', true)
      .preload('image')
      .preload('game')
      .preload('author')
      .orderBy('createdAt', 'desc')
      .limit(limit)
  }

  async findPopular(limit: number = 10): Promise<TierList[]> {
    return TierList.query()
      .where('isPublished', true)
      .preload('image')
      .preload('game')
      .preload('author')
      .orderBy('views', 'desc')
      .orderBy('createdAt', 'desc')
      .limit(limit)
  }

  async create(data: TierListCreateData): Promise<TierList> {
    return await TierList.create({
      gameId: data.gameId,
      title: data.title,
      description: data.description,
      version: data.version,
      authorId: data.authorId,
      imageId: data.imageId,
      isPublished: data.isPublished || false,
      views: 0,
    })
  }

  async update(id: number, data: TierListUpdateData): Promise<TierList | null> {
    const tierList = await TierList.find(id)
    if (!tierList) return null

    const updateData = Object.fromEntries(
      Object.entries({
        gameId: data.gameId,
        title: data.title,
        description: data.description,
        version: data.version,
        imageId: data.imageId,
        isPublished: data.isPublished,
      }).filter(([, value]) => value !== undefined)
    )

    tierList.merge(updateData)
    await tierList.save()

    return tierList
  }

  async publish(id: number): Promise<TierList | null> {
    const tierList = await TierList.find(id)
    if (!tierList) return null

    tierList.isPublished = true
    await tierList.save()

    return tierList
  }

  async unpublish(id: number): Promise<TierList | null> {
    const tierList = await TierList.find(id)
    if (!tierList) return null

    tierList.isPublished = false
    await tierList.save()

    return tierList
  }

  async incrementViews(id: number): Promise<void> {
    await TierList.query().where('id', id).increment('views', 1)
  }

  async delete(id: number): Promise<boolean> {
    const tierList = await TierList.find(id)
    if (!tierList) return false

    await tierList.delete()
    return true
  }

  async count(): Promise<number> {
    const result = await TierList.query().count('* as total')
    return Number(result[0].$extras.total)
  }

  async countPublished(): Promise<number> {
    const result = await TierList.query().where('isPublished', true).count('* as total')
    return Number(result[0].$extras.total)
  }
}
