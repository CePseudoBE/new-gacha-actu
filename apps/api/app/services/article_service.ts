import { inject } from '@adonisjs/core'
import type { ArticleCreateData, ArticleUpdateData } from '#repositories/article_repository'
import ArticleRepository from '#repositories/article_repository'
import ArticleDto from '#dtos/article'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'
import { NotFoundException } from '#exceptions/http_exceptions'

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

  async getArticleById(id: number): Promise<ArticleDto> {
    const article = await this.articleRepository.findById(id)
    if (!article) {
      throw new NotFoundException('Article non trouvé')
    }
    return new ArticleDto(article)
  }

  async getArticleBySlug(slug: string): Promise<ArticleDto> {
    const article = await this.articleRepository.findBySlug(slug)
    if (!article) {
      throw new NotFoundException('Article non trouvé')
    }
    return new ArticleDto(article)
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

  async updateArticle(id: number, data: ArticleUpdateData): Promise<ArticleDto> {
    const article = await this.articleRepository.update(id, data)
    if (!article) {
      throw new NotFoundException('Article non trouvé')
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

  async deleteArticle(id: number): Promise<void> {
    const article = await this.articleRepository.findById(id)
    if (!article) {
      throw new NotFoundException('Article non trouvé')
    }

    await this.articleRepository.delete(id)
    await cache.delete({ key: CacheService.KEYS.ARTICLES_ALL })
    await cache.delete({ key: CacheService.KEYS.ARTICLES_POPULAR })
  }
}
