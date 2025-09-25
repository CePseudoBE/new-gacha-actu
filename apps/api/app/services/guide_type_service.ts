import { inject } from '@adonisjs/core'
import GuideTypeRepository, {
  GuideTypeCreateData,
  GuideTypeUpdateData,
} from '#repositories/guide_type_repository'
import GuideTypeDto from '#dtos/guide_type'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'
import { NotFoundException } from '#exceptions/http_exceptions'

@inject()
export default class GuideTypeService {
  constructor(private guideTypeRepository: GuideTypeRepository) {}

  async getGuideTypes(): Promise<GuideTypeDto[]> {
    return cache.getOrSet({
      key: CacheService.KEYS.GUIDE_TYPES_ALL,
      ttl: CacheService.TTL.VERY_LONG,
      factory: async () => {
        const guideTypes = await this.guideTypeRepository.findAll()
        return guideTypes.map((type) => new GuideTypeDto(type))
      },
    })
  }

  async getGuideTypeById(id: number): Promise<GuideTypeDto> {
    const guideType = await this.guideTypeRepository.findById(id)
    if (!guideType) {
      throw new NotFoundException('Type de guide non trouvé')
    }
    return new GuideTypeDto(guideType)
  }

  async createGuideType(data: GuideTypeCreateData): Promise<GuideTypeDto> {
    const guideType = await this.guideTypeRepository.create(data)

    // Invalidate related caches
    await cache.delete({ key: CacheService.KEYS.GUIDE_TYPES_ALL })

    return new GuideTypeDto(guideType)
  }

  async updateGuideType(id: number, data: GuideTypeUpdateData): Promise<GuideTypeDto> {
    const guideType = await this.guideTypeRepository.update(id, data)
    if (!guideType) {
      throw new NotFoundException('Type de guide non trouvé')
    }

    // Invalidate related caches
    await cache.delete({ key: CacheService.KEYS.GUIDE_TYPES_ALL })

    return new GuideTypeDto(guideType)
  }

  async deleteGuideType(id: number): Promise<void> {
    const guideType = await this.guideTypeRepository.findById(id)
    if (!guideType) {
      throw new NotFoundException('Type de guide non trouvé')
    }

    await this.guideTypeRepository.delete(id)

    // Invalidate related caches
    await cache.delete({ key: CacheService.KEYS.GUIDE_TYPES_ALL })
  }
}
