import { inject } from '@adonisjs/core'
import DifficultyLevelRepository, {
  DifficultyLevelCreateData,
  DifficultyLevelUpdateData,
} from '#repositories/difficulty_level_repository'
import DifficultyLevelDto from '#dtos/difficulty_level'

@inject()
export default class DifficultyLevelService {
  constructor(private difficultyLevelRepository: DifficultyLevelRepository) {}

  async getDifficultyLevels(): Promise<DifficultyLevelDto[]> {
    const difficultyLevels = await this.difficultyLevelRepository.findAll()
    return difficultyLevels.map(level => new DifficultyLevelDto(level))
  }

  async getDifficultyLevelById(id: number): Promise<DifficultyLevelDto | null> {
    const difficultyLevel = await this.difficultyLevelRepository.findById(id)
    return difficultyLevel ? new DifficultyLevelDto(difficultyLevel) : null
  }

  async createDifficultyLevel(data: DifficultyLevelCreateData): Promise<DifficultyLevelDto> {
    const difficultyLevel = await this.difficultyLevelRepository.create(data)
    return new DifficultyLevelDto(difficultyLevel)
  }

  async updateDifficultyLevel(id: number, data: DifficultyLevelUpdateData): Promise<DifficultyLevelDto> {
    const difficultyLevel = await this.difficultyLevelRepository.update(id, data)
    return new DifficultyLevelDto(difficultyLevel)
  }

  async deleteDifficultyLevel(id: number): Promise<void> {
    await this.difficultyLevelRepository.delete(id)
  }
}