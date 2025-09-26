import { inject } from '@adonisjs/core'
import type {
  ArticleCategoryCreateData,
  ArticleCategoryUpdateData,
} from '#repositories/article_category_repository'
import ArticleCategoryRepository from '#repositories/article_category_repository'
import ArticleCategoryDto from '#dtos/article_category'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'
import { NotFoundException } from '#exceptions/http_exceptions'

@inject()
export default class ArticleCategoryService {
  constructor(private articleCategoryRepository: ArticleCategoryRepository) {}

  async getArticleCategories(): Promise<ArticleCategoryDto[]> {
    return await cache.getOrSet({
      key: CacheService.KEYS.ARTICLE_CATEGORIES_ALL,
      factory: async () => {
        const categories = await this.articleCategoryRepository.findAll()
        return categories.map((category) => new ArticleCategoryDto(category))
      },
      ttl: CacheService.TTL.LONG,
    })
  }

  async getArticleCategoryById(id: number): Promise<ArticleCategoryDto> {
    const category = await this.articleCategoryRepository.findById(id)
    if (!category) {
      throw new NotFoundException("Catégorie d'article non trouvée")
    }
    return new ArticleCategoryDto(category)
  }

  async getArticleCategoryBySlug(slug: string): Promise<ArticleCategoryDto> {
    const category = await this.articleCategoryRepository.findBySlug(slug)
    if (!category) {
      throw new NotFoundException("Catégorie d'article non trouvée")
    }
    return new ArticleCategoryDto(category)
  }

  async createArticleCategory(data: ArticleCategoryCreateData): Promise<ArticleCategoryDto> {
    const category = await this.articleCategoryRepository.create(data)
    await category.refresh()

    await cache.delete({ key: CacheService.KEYS.ARTICLE_CATEGORIES_ALL })

    return new ArticleCategoryDto(category)
  }

  async updateArticleCategory(
    id: number,
    data: ArticleCategoryUpdateData
  ): Promise<ArticleCategoryDto> {
    const category = await this.articleCategoryRepository.update(id, data)
    if (!category) {
      throw new NotFoundException("Catégorie d'article non trouvée")
    }

    await category.refresh()

    await cache.delete({ key: CacheService.KEYS.ARTICLE_CATEGORIES_ALL })

    return new ArticleCategoryDto(category)
  }

  async deleteArticleCategory(id: number): Promise<void> {
    const category = await this.articleCategoryRepository.findById(id)
    if (!category) {
      throw new NotFoundException("Catégorie d'article non trouvée")
    }

    await this.articleCategoryRepository.delete(id)
    await cache.delete({ key: CacheService.KEYS.ARTICLE_CATEGORIES_ALL })
  }
}
