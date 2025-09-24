import { BaseModelDto } from '@adocasts.com/dto/base'
import DifficultyLevel from '#models/difficulty_level'
import GuideDto from '#dtos/guide'

export default class DifficultyLevelDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare slug: string
  declare description: string | null
  declare createdAt: string
  declare updatedAt: string
  declare guides?: GuideDto[]

  constructor(difficultyLevel?: DifficultyLevel) {
    super()

    if (!difficultyLevel) return
    this.id = difficultyLevel.id
    this.name = difficultyLevel.name
    this.slug = difficultyLevel.slug
    this.description = difficultyLevel.description
    this.createdAt = difficultyLevel.createdAt.toISO()!
    this.updatedAt = difficultyLevel.updatedAt.toISO()!

    if (difficultyLevel.guides) {
      this.guides = GuideDto.fromArray(difficultyLevel.guides)
    }
  }
}
