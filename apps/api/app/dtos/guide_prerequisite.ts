import { BaseModelDto } from '@adocasts.com/dto/base'
import GuidePrerequisite from '#models/guide_prerequisite'
import GuideDto from '#dtos/guide'

export default class GuidePrerequisiteDto extends BaseModelDto {
  declare id: number
  declare description: string
  declare guideId: number
  declare createdAt: string
  declare updatedAt: string
  declare guide: GuideDto | null

  constructor(guidePrerequisite?: GuidePrerequisite) {
    super()

    if (!guidePrerequisite) return
    this.id = guidePrerequisite.id
    this.description = guidePrerequisite.description
    this.guideId = guidePrerequisite.guideId
    this.createdAt = guidePrerequisite.createdAt.toISO()!
    this.updatedAt = guidePrerequisite.updatedAt.toISO()!
    this.guide = guidePrerequisite.guide && new GuideDto(guidePrerequisite.guide)
  }
}
