import { inject } from '@adonisjs/core'
import type {
  ArticleCategoryCreateData,
  ArticleCategoryUpdateData,
} from '#repositories/article_category_repository'
import ArticleCategoryRepository from '#repositories/article_category_repository'
import ArticleCategoryDto from '#dtos/article_category'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'

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

  async getArticleCategoryById(id: number): Promise<ArticleCategoryDto | null> {
    const category = await this.articleCategoryRepository.findById(id)
    return category ? new ArticleCategoryDto(category) : null
  }

  async getArticleCategoryBySlug(slug: string): Promise<ArticleCategoryDto | null> {
    const category = await this.articleCategoryRepository.findBySlug(slug)
    return category ? new ArticleCategoryDto(category) : null
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
  ): Promise<ArticleCategoryDto | null> {
    const category = await this.articleCategoryRepository.update(id, data)
    if (!category) {
      return null
    }

    await category.refresh()

    await cache.delete({ key: CacheService.KEYS.ARTICLE_CATEGORIES_ALL })

    return new ArticleCategoryDto(category)
  }

  async deleteArticleCategory(id: number): Promise<boolean> {
    const result = await this.articleCategoryRepository.delete(id)

    if (result) {
      await cache.delete({ key: CacheService.KEYS.ARTICLE_CATEGORIES_ALL })
    }

    return result
  }
}
