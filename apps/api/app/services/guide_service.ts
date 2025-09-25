import { inject } from '@adonisjs/core'
import GuideRepository, {
  GuideCreateData,
  GuideFilters,
  GuideUpdateData,
} from '#repositories/guide_repository'
import GuideDto from '#dtos/guide'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'

export interface GuideListResponse {
  guides: GuideDto[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

@inject()
export default class GuideService {
  constructor(private guideRepository: GuideRepository) {}

  async getGuides(): Promise<GuideDto[]> {
    return cache.getOrSet({
      key: CacheService.KEYS.GUIDES_ALL,
      ttl: CacheService.TTL.MEDIUM,
      factory: async () => {
        const guides = await this.guideRepository.findAll()
        return guides.map((guide) => new GuideDto(guide))
      },
    })
  }

  async getGuidesWithFilters(filters: GuideFilters): Promise<GuideListResponse> {
    // (on ne met pas en cache ici car les filtres/pagination produisent de nombreuses combinaisons)
    const { guides, total } = await this.guideRepository.findWithFilters(filters)

    const guideDtos = guides.map((guide) => new GuideDto(guide))

    if (filters.page !== undefined || filters.limit !== undefined) {
      const page = filters.page || 1
      const limit = filters.limit || 20
      const totalPages = Math.ceil(total / limit)
      const skip = (page - 1) * limit

      return {
        guides: guideDtos,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: skip + guides.length < total,
          hasPrevPage: page > 1,
        },
      }
    }

    return { guides: guideDtos }
  }

  async getGuideById(id: number): Promise<GuideDto | null> {
    const guide = await this.guideRepository.findById(id)
    return guide ? new GuideDto(guide) : null
  }

  async getGuideBySlug(slug: string): Promise<GuideDto | null> {
    const guide = await this.guideRepository.findBySlug(slug)
    return guide ? new GuideDto(guide) : null
  }

  async getGuideBySlugAndIncrementViews(slug: string): Promise<GuideDto | null> {
    // pas de cache ici : la vue est incrémentée
    const guide = await this.guideRepository.findBySlug(slug)
    if (!guide) return null

    const updatedGuide = await this.guideRepository.incrementViewCount(guide.id)
    return updatedGuide ? new GuideDto(updatedGuide) : null
  }

  async getPopularGuides(): Promise<GuideDto[]> {
    return cache.getOrSet({
      key: CacheService.KEYS.GUIDES_POPULAR,
      ttl: CacheService.TTL.MEDIUM,
      factory: async () => {
        const guides = await this.guideRepository.findPopular()
        return guides.map((guide) => new GuideDto(guide))
      },
    })
  }

  async getGuidesByGame(gameId: number): Promise<GuideDto[]> {
    return cache.getOrSet({
      key: CacheService.KEYS.GUIDES_BY_GAME(gameId),
      ttl: CacheService.TTL.MEDIUM,
      factory: async () => {
        const guides = await this.guideRepository.findByGame(gameId)
        return guides.map((guide) => new GuideDto(guide))
      },
    })
  }

  async createGuide(data: GuideCreateData): Promise<GuideDto> {
    if (!data.sections || data.sections.length === 0) {
      throw new Error('Guide must contain at least one section')
    }

    const guide = await this.guideRepository.create(data)

    // recharger la version complète (relations) pour la réponse
    const completeGuide = await this.guideRepository.findById(guide.id)
    if (!completeGuide) {
      throw new Error('Failed to fetch created guide')
    }

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.GUIDES_ALL })
    await cache.delete({ key: CacheService.KEYS.GUIDES_POPULAR })
    if (completeGuide.gameId) {
      await cache.delete({ key: CacheService.KEYS.GUIDES_BY_GAME(completeGuide.gameId) })
    }

    return new GuideDto(completeGuide)
  }

  async updateGuide(id: number, data: GuideUpdateData): Promise<GuideDto | null> {
    if (data.sections !== undefined && data.sections.length === 0) {
      throw new Error('Guide must contain at least one section')
    }

    const guide = await this.guideRepository.update(id, data)
    if (!guide) return null

    const completeGuide = await this.guideRepository.findById(guide.id)
    if (!completeGuide) {
      throw new Error('Failed to fetch updated guide')
    }

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.GUIDES_ALL })
    await cache.delete({ key: CacheService.KEYS.GUIDES_POPULAR })
    if (completeGuide.gameId) {
      await cache.delete({ key: CacheService.KEYS.GUIDES_BY_GAME(completeGuide.gameId) })
    }

    return new GuideDto(completeGuide)
  }

  async deleteGuide(id: number): Promise<boolean> {
    const guide = await this.guideRepository.findById(id)
    const result = await this.guideRepository.delete(id)

    if (result && guide) {
      // Invalidation des caches liés
      await cache.delete({ key: CacheService.KEYS.GUIDES_ALL })
      await cache.delete({ key: CacheService.KEYS.GUIDES_POPULAR })
      if (guide.gameId) {
        await cache.delete({ key: CacheService.KEYS.GUIDES_BY_GAME(guide.gameId) })
      }
    }

    return result
  }
}
