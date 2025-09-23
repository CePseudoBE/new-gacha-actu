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
  genreIds?: number[]
  platformIds?: number[]
  tagIds?: number[]
}

export interface GameUpdateData extends Partial<GameCreateData> {}

export default class GameRepository {
  /**
   * Récupère tous les jeux avec pagination et filtres
   */
  async findMany(
    filters: GameFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<ModelPaginatorContract<Game>> {
    const query = Game.query()

    // Recherche par nom
    if (filters.search) {
      query.where((builder) => {
        builder
          .where('name', 'ILIKE', `%${filters.search}%`)
          .orWhere('description', 'ILIKE', `%${filters.search}%`)
      })
    }

    // Filtrer par popularité
    if (filters.isPopular !== undefined) {
      query.where('isPopular', filters.isPopular)
    }

    // Filtrer par genres
    if (filters.genreIds && filters.genreIds.length > 0) {
      query.whereHas('genres', (genreQuery) => {
        genreQuery.whereIn('id', filters.genreIds!)
      })
    }

    // Filtrer par plateformes
    if (filters.platformIds && filters.platformIds.length > 0) {
      query.whereHas('platforms', (platformQuery) => {
        platformQuery.whereIn('id', filters.platformIds!)
      })
    }

    // Tri : populaires d'abord, puis par nom
    query.orderBy([
      { column: 'isPopular', order: 'desc' },
      { column: 'name', order: 'asc' },
    ])

    return query.paginate(page, perPage)
  }

  /**
   * Récupère un jeu par son ID avec toutes les relations
   */
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

  /**
   * Récupère un jeu par son slug
   */
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

  /**
   * Vérifie si un slug existe déjà
   */
  async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const query = Game.query().where('slug', slug)

    if (excludeId) {
      query.where('id', '!=', excludeId)
    }

    const game = await query.first()
    return !!game
  }

  /**
   * Crée un nouveau jeu
   */
  async create(data: GameCreateData): Promise<Game> {
    const game = await Game.create({
      name: data.name,
      description: data.description,
      releaseDate: data.releaseDate,
      isPopular: data.isPopular || false,
      officialSite: data.officialSite,
      wiki: data.wiki,
    })

    // Attacher les genres
    if (data.genreIds && data.genreIds.length > 0) {
      await game.related('genres').attach(data.genreIds)
    }

    // Attacher les plateformes
    if (data.platformIds && data.platformIds.length > 0) {
      await game.related('platforms').attach(data.platformIds)
    }

    // Attacher les tags
    if (data.tagIds && data.tagIds.length > 0) {
      await game.related('tags').attach(data.tagIds)
    }

    // Recharger avec les relations
    await game.load('genres')
    await game.load('platforms')
    await game.load('tags')

    return game
  }

  /**
   * Met à jour un jeu
   */
  async update(id: number, data: GameUpdateData): Promise<Game | null> {
    const game = await Game.find(id)
    if (!game) return null

    game.merge({
      name: data.name,
      description: data.description,
      releaseDate: data.releaseDate,
      isPopular: data.isPopular,
      officialSite: data.officialSite,
      wiki: data.wiki,
    })

    await game.save()

    // Mettre à jour les genres
    if (data.genreIds !== undefined) {
      await game.related('genres').sync(data.genreIds)
    }

    // Mettre à jour les plateformes
    if (data.platformIds !== undefined) {
      await game.related('platforms').sync(data.platformIds)
    }

    // Mettre à jour les tags
    if (data.tagIds !== undefined) {
      await game.related('tags').sync(data.tagIds)
    }

    // Recharger avec les relations
    await game.load('genres')
    await game.load('platforms')
    await game.load('tags')

    return game
  }

  /**
   * Supprime un jeu
   */
  async delete(id: number): Promise<boolean> {
    const game = await Game.find(id)
    if (!game) return false

    // Les relations many-to-many seront automatiquement supprimées
    // grâce aux contraintes de clé étrangère
    await game.delete()
    return true
  }

  /**
   * Récupère les jeux populaires
   */
  async findPopular(limit: number = 10): Promise<Game[]> {
    return Game.query()
      .where('isPopular', true)
      .preload('genres')
      .preload('platforms')
      .orderBy('name', 'asc')
      .limit(limit)
  }

  /**
   * Compte le nombre total de jeux
   */
  async count(): Promise<number> {
    const result = await Game.query().count('* as total')
    return Number(result[0].$extras.total)
  }

  /**
   * Récupère les statistiques des jeux
   */
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
