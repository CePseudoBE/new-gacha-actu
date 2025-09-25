import { inject } from '@adonisjs/core'
import DifficultyLevelRepository, {
  DifficultyLevelCreateData,
  DifficultyLevelUpdateData,
} from '#repositories/difficulty_level_repository'
import DifficultyLevelDto from '#dtos/difficulty_level'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'

@inject()
export default class DifficultyLevelService {
  constructor(private difficultyLevelRepository: DifficultyLevelRepository) {}

  async getDifficultyLevels(): Promise<DifficultyLevelDto[]> {
    return await cache.getOrSet({
      key: CacheService.KEYS.DIFFICULTY_LEVELS_ALL,
      factory: async () => {
        const difficultyLevels = await this.difficultyLevelRepository.findAll()
        return difficultyLevels.map((level) => new DifficultyLevelDto(level))
      },
      ttl: CacheService.TTL.LONG,
    })
  }

  async getDifficultyLevelById(id: number): Promise<DifficultyLevelDto | null> {
    const difficultyLevel = await this.difficultyLevelRepository.findById(id)
    return difficultyLevel ? new DifficultyLevelDto(difficultyLevel) : null
  }

  async createDifficultyLevel(data: DifficultyLevelCreateData): Promise<DifficultyLevelDto> {
    const difficultyLevel = await this.difficultyLevelRepository.create(data)

    await cache.delete({
      key: CacheService.KEYS.DIFFICULTY_LEVELS_ALL,
    })

    return new DifficultyLevelDto(difficultyLevel)
  }

  async updateDifficultyLevel(
    id: number,
    data: DifficultyLevelUpdateData
  ): Promise<DifficultyLevelDto> {
    const difficultyLevel = await this.difficultyLevelRepository.update(id, data)

    await cache.delete({
      key: CacheService.KEYS.DIFFICULTY_LEVELS_ALL,
    })

    return new DifficultyLevelDto(difficultyLevel)
  }

  async deleteDifficultyLevel(id: number): Promise<void> {
    await this.difficultyLevelRepository.delete(id)

    await cache.delete({
      key: CacheService.KEYS.DIFFICULTY_LEVELS_ALL,
    })
  }
}
