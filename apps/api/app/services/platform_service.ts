import { inject } from '@adonisjs/core'
import PlatformRepository, {
  PlatformCreateData,
  PlatformUpdateData,
} from '#repositories/platform_repository'
import PlatformDto from '#dtos/platform'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'
import { NotFoundException } from '#exceptions/http_exceptions'

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

  async getPlatformById(id: number): Promise<PlatformDto> {
    const platform = await this.platformRepository.findById(id)
    if (!platform) {
      throw new NotFoundException('Plateforme non trouvée')
    }
    return new PlatformDto(platform)
  }

  async getPlatformBySlug(slug: string): Promise<PlatformDto> {
    const platform = await this.platformRepository.findBySlug(slug)
    if (!platform) {
      throw new NotFoundException('Plateforme non trouvée')
    }
    return new PlatformDto(platform)
  }

  async createPlatform(data: PlatformCreateData): Promise<PlatformDto> {
    const platform = await this.platformRepository.create(data)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.PLATFORMS_ALL })

    return new PlatformDto(platform)
  }

  async updatePlatform(id: number, data: PlatformUpdateData): Promise<PlatformDto> {
    const updatedPlatform = await this.platformRepository.update(id, data)
    if (!updatedPlatform) {
      throw new NotFoundException('Plateforme non trouvée')
    }

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.PLATFORMS_ALL })

    return new PlatformDto(updatedPlatform)
  }

  async deletePlatform(id: number): Promise<void> {
    const platform = await this.platformRepository.findById(id)
    if (!platform) {
      throw new NotFoundException('Plateforme non trouvée')
    }

    await this.platformRepository.delete(id)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.PLATFORMS_ALL })
  }
}
