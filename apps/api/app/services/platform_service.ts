import { inject } from '@adonisjs/core'
import PlatformRepository, {
  PlatformCreateData,
  PlatformFilters,
  PlatformUpdateData,
} from '#repositories/platform_repository'
import PlatformDto from '#dtos/platform'
import type { SimplePaginatorMetaKeys } from '@adonisjs/lucid/types/querybuilder'

@inject()
export default class PlatformService {
  constructor(private platformRepository: PlatformRepository) {}

  async getPlatforms(
    filters: PlatformFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<{ data: PlatformDto[]; meta: SimplePaginatorMetaKeys }> {
    if (page < 1) page = 1
    if (perPage < 1 || perPage > 100) perPage = 20

    const sanitizedFilters: PlatformFilters = {
      search: filters.search?.trim() || undefined,
    }

    const platforms = await this.platformRepository.findMany(sanitizedFilters, page, perPage)

    return {
      data: PlatformDto.fromArray(platforms.all()),
      meta: platforms.getMeta(),
    }
  }

  async getAllPlatforms(): Promise<PlatformDto[]> {
    const platforms = await this.platformRepository.findAll()
    return PlatformDto.fromArray(platforms)
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
    return new PlatformDto(platform)
  }

  async updatePlatform(id: number, data: PlatformUpdateData): Promise<PlatformDto> {
    const updatedPlatform = await this.platformRepository.update(id, data)
    return new PlatformDto(updatedPlatform)
  }

  async deletePlatform(id: number): Promise<void> {
    await this.platformRepository.delete(id)
  }
}