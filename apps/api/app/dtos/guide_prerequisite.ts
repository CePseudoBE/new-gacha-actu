import { BaseModelDto } from '@adocasts.com/dto/base'
import GuidePrerequisite from '#models/guide_prerequisite'

export default class GuidePrerequisiteDto extends BaseModelDto {
  declare id: number
  declare description: string
  declare guideId: number
  declare createdAt: string
  declare updatedAt: string

  constructor(guidePrerequisite?: GuidePrerequisite) {
    super()

    if (!guidePrerequisite) return
    this.id = guidePrerequisite.id
    this.description = guidePrerequisite.description
    this.guideId = guidePrerequisite.guideId
    this.createdAt = guidePrerequisite.createdAt.toISO()!
    this.updatedAt = guidePrerequisite.updatedAt.toISO()!
  }
}
