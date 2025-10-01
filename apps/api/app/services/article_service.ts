import { inject } from '@adonisjs/core'
import type { ArticleCreateData, ArticleUpdateData } from '#repositories/article_repository'
import ArticleRepository from '#repositories/article_repository'
import ArticleDto from '#dtos/article'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'
import { NotFoundException } from '#exceptions/http_exceptions'
import ImageService from '#services/image_service'
import { MultipartFile } from '@adonisjs/core/bodyparser'

@inject()
export default class ArticleService {
  constructor(
    private articleRepository: ArticleRepository,
    private imageService: ImageService
  ) {}

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
    return await cache.getOrSet({
      key: CacheService.KEYS.ARTICLES_BY_SLUG(slug),
      ttl: CacheService.TTL.LONG,
      factory: async () => {
        const article = await this.articleRepository.findBySlug(slug)
        if (!article) {
          throw new NotFoundException('Article non trouvé')
        }
        return new ArticleDto(article)
      },
    })
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
    return await cache.getOrSet({
      key: CacheService.KEYS.ARTICLES_BY_GAME(gameId),
      ttl: CacheService.TTL.MEDIUM,
      factory: async () => {
        const articles = await this.articleRepository.findByGame(gameId)
        return articles.map((article) => new ArticleDto(article))
      },
    })
  }

  async getArticlesByCategory(categoryId: number): Promise<ArticleDto[]> {
    const articles = await this.articleRepository.findByCategory(categoryId)
    return articles.map((article) => new ArticleDto(article))
  }

  async createArticle(data: ArticleCreateData, imageFile?: MultipartFile): Promise<ArticleDto> {
    let imageId: number | undefined

    if (imageFile) {
      const uploadedImage = await this.imageService.uploadImage(imageFile)
      imageId = uploadedImage.id
    }

    const articleData = {
      ...data,
      imageId,
    }

    const article = await this.articleRepository.create(articleData)
    await article.refresh()
    await article.load('game')
    await article.load('category')
    await article.load('tags')
    await article.load('seoKeywords')
    await article.load('image')

    await cache.delete({ key: CacheService.KEYS.ARTICLES_ALL })
    await cache.delete({ key: CacheService.KEYS.ARTICLES_POPULAR })

    return new ArticleDto(article)
  }

  async updateArticle(
    id: number,
    data: ArticleUpdateData,
    imageFile?: MultipartFile
  ): Promise<ArticleDto> {
    let updateData = { ...data }

    if (imageFile) {
      const uploadedImage = await this.imageService.uploadImage(imageFile)
      updateData.imageId = uploadedImage.id
    }

    const article = await this.articleRepository.update(id, updateData)
    if (!article) {
      throw new NotFoundException('Article non trouvé')
    }

    await article.refresh()
    await article.load('game')
    await article.load('category')
    await article.load('tags')
    await article.load('seoKeywords')
    await article.load('image')

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
