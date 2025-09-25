import { inject } from '@adonisjs/core'
import SeoKeywordRepository, {
  SeoKeywordCreateData,
  SeoKeywordUpdateData,
} from '#repositories/seo_keyword_repository'
import SeoKeywordDto from '#dtos/seo_keyword'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'

@inject()
export default class SeoKeywordService {
  constructor(private seoKeywordRepository: SeoKeywordRepository) {}

  async getSeoKeywords(): Promise<SeoKeywordDto[]> {
    return cache.getOrSet({
      key: CacheService.KEYS.SEO_KEYWORDS_ALL,
      ttl: CacheService.TTL.LONG,
      factory: async () => {
        const seoKeywords = await this.seoKeywordRepository.findAll()
        return seoKeywords.map((keyword) => new SeoKeywordDto(keyword))
      },
    })
  }

  async getSeoKeywordById(id: number): Promise<SeoKeywordDto | null> {
    const seoKeyword = await this.seoKeywordRepository.findById(id)
    return seoKeyword ? new SeoKeywordDto(seoKeyword) : null
  }

  async createSeoKeyword(data: SeoKeywordCreateData): Promise<SeoKeywordDto> {
    const seoKeyword = await this.seoKeywordRepository.create(data)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.SEO_KEYWORDS_ALL })

    return new SeoKeywordDto(seoKeyword)
  }

  async updateSeoKeyword(id: number, data: SeoKeywordUpdateData): Promise<SeoKeywordDto> {
    const seoKeyword = await this.seoKeywordRepository.update(id, data)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.SEO_KEYWORDS_ALL })

    return new SeoKeywordDto(seoKeyword)
  }

  async deleteSeoKeyword(id: number): Promise<void> {
    await this.seoKeywordRepository.delete(id)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.SEO_KEYWORDS_ALL })
  }
}
