import Article from '#models/article'
import { DateTime } from 'luxon'

export interface ArticleCreateData {
  title: string
  summary: string
  author: string
  publishedAt: Date
  slug?: string
  imageId?: number
  content: string
  metaDescription?: string
  readingTime?: number
  categoryId?: number
  isPopular?: boolean
  gameId: number
  tagIds?: number[]
  seoKeywordIds?: number[]
}

export interface ArticleUpdateData {
  title?: string
  summary?: string
  author?: string
  publishedAt?: Date
  slug?: string
  imageId?: number
  content?: string
  metaDescription?: string
  readingTime?: number
  categoryId?: number
  isPopular?: boolean
  gameId?: number
  tagIds?: number[]
  seoKeywordIds?: number[]
}

export default class ArticleRepository {
  async findAll(): Promise<Article[]> {
    return Article.query()
      .preload('game')
      .preload('category')
      .preload('tags')
      .preload('seoKeywords')
      .preload('image')
      .orderBy('publishedAt', 'desc')
  }

  async findById(id: number): Promise<Article | null> {
    return Article.query()
      .where('id', id)
      .preload('game')
      .preload('category')
      .preload('tags')
      .preload('seoKeywords')
      .preload('image')
      .first()
  }

  async findBySlug(slug: string): Promise<Article | null> {
    return Article.query()
      .where('slug', slug)
      .preload('game')
      .preload('category')
      .preload('tags')
      .preload('seoKeywords')
      .preload('image')
      .first()
  }

  async findPopular(): Promise<Article[]> {
    return Article.query()
      .where('isPopular', true)
      .preload('game')
      .preload('category')
      .preload('tags')
      .preload('seoKeywords')
      .preload('image')
      .orderBy('publishedAt', 'desc')
  }

  async findByGame(gameId: number): Promise<Article[]> {
    return Article.query()
      .where('gameId', gameId)
      .preload('game')
      .preload('category')
      .preload('tags')
      .preload('seoKeywords')
      .preload('image')
      .orderBy('publishedAt', 'desc')
  }

  async findByCategory(categoryId: number): Promise<Article[]> {
    return Article.query()
      .where('categoryId', categoryId)
      .preload('game')
      .preload('category')
      .preload('tags')
      .preload('seoKeywords')
      .preload('image')
      .orderBy('publishedAt', 'desc')
  }

  async create(data: ArticleCreateData): Promise<Article> {
    const { tagIds, seoKeywordIds, ...articleData } = data

    const article = await Article.create({
      ...articleData,
      publishedAt: DateTime.fromJSDate(data.publishedAt),
    })

    // Attach relations
    if (tagIds && tagIds.length > 0) {
      await article.related('tags').attach(tagIds)
    }

    if (seoKeywordIds && seoKeywordIds.length > 0) {
      await article.related('seoKeywords').attach(seoKeywordIds)
    }

    return article
  }

  async update(id: number, data: ArticleUpdateData): Promise<Article | null> {
    const article = await Article.find(id)
    if (!article) {
      return null
    }

    const { tagIds, seoKeywordIds, ...updateData } = data

    const mergeData: any = {
      ...updateData,
    }

    if (data.publishedAt) {
      mergeData.publishedAt = DateTime.fromJSDate(data.publishedAt as Date)
    }

    article.merge(mergeData)
    await article.save()

    // Sync relations
    if (tagIds !== undefined) {
      await article.related('tags').sync(tagIds)
    }

    if (seoKeywordIds !== undefined) {
      await article.related('seoKeywords').sync(seoKeywordIds)
    }

    return article
  }

  async delete(id: number): Promise<boolean> {
    const article = await Article.find(id)
    if (!article) {
      return false
    }

    await article.delete()
    return true
  }
}
