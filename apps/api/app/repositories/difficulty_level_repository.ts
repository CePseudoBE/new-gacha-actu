import DifficultyLevel from '#models/difficulty_level'

export interface DifficultyLevelCreateData {
  name: string
  description?: string
}

export interface DifficultyLevelUpdateData extends Partial<DifficultyLevelCreateData> {}

export default class DifficultyLevelRepository {
  async findAll(): Promise<DifficultyLevel[]> {
    return DifficultyLevel.query().orderBy('name', 'asc')
  }

  async findById(id: number): Promise<DifficultyLevel | null> {
    return DifficultyLevel.find(id)
  }

  async create(data: DifficultyLevelCreateData): Promise<DifficultyLevel> {
    return DifficultyLevel.create(data)
  }

  async update(id: number, data: DifficultyLevelUpdateData): Promise<DifficultyLevel> {
    const difficultyLevel = await DifficultyLevel.findOrFail(id)
    difficultyLevel.merge(data)
    await difficultyLevel.save()
    return difficultyLevel
  }

  async delete(id: number): Promise<void> {
    const difficultyLevel = await DifficultyLevel.findOrFail(id)
    await difficultyLevel.delete()
  }
}