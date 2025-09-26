import Game from '#models/game'
import { DateTime } from 'luxon'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export interface GameFilters {
  search?: string
  isPopular?: boolean
  genreIds?: number[]
  platformIds?: number[]
}

export interface GameCreateData {
  name: string
  description: string
  releaseDate: DateTime
  isPopular?: boolean
  officialSite?: string
  wiki?: string
  imageId?: number
  genreIds?: number[]
  platformIds?: number[]
  tagIds?: number[]
}

export interface GameUpdateData extends Partial<GameCreateData> {}

export default class GameRepository {
  async findMany(
    filters: GameFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<ModelPaginatorContract<Game>> {
    const query = Game.query()

    if (filters.search) {
      query.where((builder) => {
        builder
          .where('name', 'ILIKE', `%${filters.search}%`)
          .orWhere('description', 'ILIKE', `%${filters.search}%`)
      })
    }

    if (filters.isPopular !== undefined) {
      query.where('isPopular', filters.isPopular)
    }

    if (filters.genreIds && filters.genreIds.length > 0) {
      query.whereHas('genres', (genreQuery) => {
        genreQuery.whereIn('id', filters.genreIds!)
      })
    }

    if (filters.platformIds && filters.platformIds.length > 0) {
      query.whereHas('platforms', (platformQuery) => {
        platformQuery.whereIn('id', filters.platformIds!)
      })
    }

    query.orderBy([
      { column: 'is_popular', order: 'desc' },
      { column: 'name', order: 'asc' },
    ])

    return query.paginate(page, perPage)
  }

  async findById(id: number): Promise<Game | null> {
    return Game.query()
      .where('id', id)
      .preload('genres')
      .preload('platforms')
      .preload('tags')
      .preload('articles', (articleQuery) => {
        articleQuery
          .select(['id', 'title', 'slug', 'summary', 'publishedAt', 'isPopular'])
          .orderBy('publishedAt', 'desc')
          .limit(5)
      })
      .preload('guides', (guideQuery) => {
        guideQuery
          .select(['id', 'title', 'slug', 'summary', 'publishedAt', 'isPopular'])
          .orderBy('publishedAt', 'desc')
          .limit(5)
      })
      .first()
  }

  async hasContent(id: number): Promise<boolean | null> {
    const result = await Game.query()
      .where('id', id)
      .withCount('articles')
      .withCount('guides')
      .first()

    if (!result) return null

    return result.$extras.articles_count > 0 || result.$extras.guides_count > 0
  }

  async findBySlug(slug: string): Promise<Game | null> {
    return Game.query()
      .where('slug', slug)
      .preload('genres')
      .preload('platforms')
      .preload('tags')
      .preload('articles', (articleQuery) => {
        articleQuery
          .select(['id', 'title', 'slug', 'summary', 'publishedAt', 'isPopular'])
          .orderBy('publishedAt', 'desc')
          .limit(10)
      })
      .preload('guides', (guideQuery) => {
        guideQuery
          .select(['id', 'title', 'slug', 'summary', 'publishedAt', 'isPopular'])
          .orderBy('publishedAt', 'desc')
          .limit(10)
      })
      .first()
  }

  async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const query = Game.query().where('slug', slug)

    if (excludeId) {
      query.where('id', '!=', excludeId)
    }

    const game = await query.first()
    return !!game
  }

  async create(data: GameCreateData): Promise<Game> {
    const game = await Game.create({
      name: data.name,
      description: data.description,
      releaseDate: data.releaseDate,
      isPopular: data.isPopular || false,
      officialSite: data.officialSite,
      wiki: data.wiki,
      imageId: data.imageId,
    })

    if (data.genreIds && data.genreIds.length > 0) {
      await game.related('genres').attach(data.genreIds)
    }

    if (data.platformIds && data.platformIds.length > 0) {
      await game.related('platforms').attach(data.platformIds)
    }

    if (data.tagIds && data.tagIds.length > 0) {
      await game.related('tags').attach(data.tagIds)
    }

    await game.load('genres')
    await game.load('platforms')
    await game.load('tags')

    return game
  }

  async update(id: number, data: GameUpdateData): Promise<Game | null> {
    const game = await Game.find(id)
    if (!game) return null

    const updateData = Object.fromEntries(
      Object.entries({
        name: data.name,
        description: data.description,
        releaseDate: data.releaseDate,
        isPopular: data.isPopular,
        officialSite: data.officialSite,
        wiki: data.wiki,
        imageId: data.imageId,
      }).filter(([, value]) => value !== undefined)
    )

    game.merge(updateData)
    await game.save()

    if (data.genreIds !== undefined) {
      await game.related('genres').sync(data.genreIds)
    }

    if (data.platformIds !== undefined) {
      await game.related('platforms').sync(data.platformIds)
    }

    if (data.tagIds !== undefined) {
      await game.related('tags').sync(data.tagIds)
    }

    await game.load('genres')
    await game.load('platforms')
    await game.load('tags')

    return game
  }

  async delete(id: number): Promise<boolean> {
    const game = await Game.find(id)
    if (!game) return false

    await game.delete()
    return true
  }

  async findPopular(limit: number = 10): Promise<Game[]> {
    return Game.query()
      .where('isPopular', true)
      .preload('genres')
      .preload('platforms')
      .orderBy('name', 'asc')
      .limit(limit)
  }

  async count(): Promise<number> {
    const result = await Game.query().count('* as total')
    return Number(result[0].$extras.total)
  }

  async getStats(): Promise<{
    total: number
    popular: number
    withArticles: number
    withGuides: number
  }> {
    const [total, popular, withArticles, withGuides] = await Promise.all([
      this.count(),
      Game.query().where('isPopular', true).count('* as total'),
      Game.query().has('articles').count('* as total'),
      Game.query().has('guides').count('* as total'),
    ])

    return {
      total,
      popular: Number(popular[0].$extras.total),
      withArticles: Number(withArticles[0].$extras.total),
      withGuides: Number(withGuides[0].$extras.total),
    }
  }
}
