import { inject } from '@adonisjs/core'
import TierRepository, { TierUpdateData } from '#repositories/tier_repository'
import { NotFoundException } from '#exceptions/http_exceptions'
import TierDto from '#dtos/tier'
import cache from '@adonisjs/cache/services/main'
import CacheService from '#services/cache_service'

@inject()
export default class TierService {
  constructor(private tierRepository: TierRepository) {}

  async getAllTiers(): Promise<TierDto[]> {
    return await cache.getOrSet({
      key: CacheService.KEYS.TIERS_ALL,
      ttl: CacheService.TTL.VERY_LONG,
      factory: async () => {
        const tiers = await this.tierRepository.findAll()
        return TierDto.fromArray(tiers)
      },
    })
  }

  async getTierById(id: number): Promise<TierDto> {
    const tier = await this.tierRepository.findById(id)
    if (!tier) {
      throw new NotFoundException('Tier non trouvé')
    }
    return new TierDto(tier)
  }

  async updateTier(id: number, data: TierUpdateData): Promise<TierDto> {
    const updatedTier = await this.tierRepository.update(id, data)
    if (!updatedTier) {
      throw new NotFoundException('Tier non trouvé')
    }

    await cache.delete({ key: CacheService.KEYS.TIERS_ALL })

    return new TierDto(updatedTier)
  }
}
