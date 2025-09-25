import { inject } from '@adonisjs/core'
import type { ArticleCreateData, ArticleUpdateData } from '#repositories/article_repository'
import ArticleRepository from '#repositories/article_repository'
import ArticleDto from '#dtos/article'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'

@inject()
export default class ArticleService {
  constructor(private articleRepository: ArticleRepository) {}

  async getArticles(): Promise<ArticleDto[]> {
    return await cache.getOrSet({
      key: CacheService.KEYS.ARTICLES_ALL,
      factory: async () => {
        const articles = await this.articleRepository.findAll()
        return articles.map((article) => new ArticleDto(article))
      },
      ttl: CacheService.TTL.MEDIUM,
    })
  }

  async getArticleById(id: number): Promise<ArticleDto | null> {
    const article = await this.articleRepository.findById(id)
    return article ? new ArticleDto(article) : null
  }

  async getArticleBySlug(slug: string): Promise<ArticleDto | null> {
    const article = await this.articleRepository.findBySlug(slug)
    return article ? new ArticleDto(article) : null
  }

  async getPopularArticles(): Promise<ArticleDto[]> {
    return await cache.getOrSet({
      key: CacheService.KEYS.ARTICLES_POPULAR,
      factory: async () => {
        const articles = await this.articleRepository.findPopular()
        return articles.map((article) => new ArticleDto(article))
      },
      ttl: CacheService.TTL.MEDIUM,
    })
  }

  async getArticlesByGame(gameId: number): Promise<ArticleDto[]> {
    const articles = await this.articleRepository.findByGame(gameId)
    return articles.map((article) => new ArticleDto(article))
  }

  async getArticlesByCategory(categoryId: number): Promise<ArticleDto[]> {
    const articles = await this.articleRepository.findByCategory(categoryId)
    return articles.map((article) => new ArticleDto(article))
  }

  async createArticle(data: ArticleCreateData): Promise<ArticleDto> {
    const article = await this.articleRepository.create(data)
    await article.refresh()
    await article.load('game')
    await article.load('category')
    await article.load('tags')
    await article.load('seoKeywords')

    await cache.delete({ key: CacheService.KEYS.ARTICLES_ALL })
    await cache.delete({ key: CacheService.KEYS.ARTICLES_POPULAR })

    return new ArticleDto(article)
  }

  async updateArticle(id: number, data: ArticleUpdateData): Promise<ArticleDto | null> {
    const article = await this.articleRepository.update(id, data)
    if (!article) {
      return null
    }

    await article.refresh()
    await article.load('game')
    await article.load('category')
    await article.load('tags')
    await article.load('seoKeywords')

    await cache.delete({ key: CacheService.KEYS.ARTICLES_ALL })
    await cache.delete({ key: CacheService.KEYS.ARTICLES_POPULAR })

    return new ArticleDto(article)
  }

  async deleteArticle(id: number): Promise<boolean> {
    const result = await this.articleRepository.delete(id)

    if (result) {
      await cache.delete({ key: CacheService.KEYS.ARTICLES_ALL })
      await cache.delete({ key: CacheService.KEYS.ARTICLES_POPULAR })
    }

    return result
  }
}
