import { inject } from '@adonisjs/core'
import PlatformRepository, {
  PlatformCreateData,
  PlatformUpdateData,
} from '#repositories/platform_repository'
import PlatformDto from '#dtos/platform'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'

@inject()
export default class PlatformService {
  constructor(private platformRepository: PlatformRepository) {}

  async getAllPlatforms(): Promise<PlatformDto[]> {
    return cache.getOrSet({
      key: CacheService.KEYS.PLATFORMS_ALL,
      ttl: CacheService.TTL.LONG,
      factory: async () => {
        const platforms = await this.platformRepository.findAll()
        return PlatformDto.fromArray(platforms)
      },
    })
  }

  async getPlatformById(id: number): Promise<PlatformDto | null> {
    const platform = await this.platformRepository.findById(id)
    return platform ? new PlatformDto(platform) : null
  }

  async getPlatformBySlug(slug: string): Promise<PlatformDto | null> {
    const platform = await this.platformRepository.findBySlug(slug)
    return platform ? new PlatformDto(platform) : null
  }

  async createPlatform(data: PlatformCreateData): Promise<PlatformDto> {
    const platform = await this.platformRepository.create(data)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.PLATFORMS_ALL })

    return new PlatformDto(platform)
  }

  async updatePlatform(id: number, data: PlatformUpdateData): Promise<PlatformDto> {
    const updatedPlatform = await this.platformRepository.update(id, data)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.PLATFORMS_ALL })

    return new PlatformDto(updatedPlatform)
  }

  async deletePlatform(id: number): Promise<void> {
    await this.platformRepository.delete(id)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.PLATFORMS_ALL })
  }
}
