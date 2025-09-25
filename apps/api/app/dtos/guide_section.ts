import { BaseModelDto } from '@adocasts.com/dto/base'
import GuideSection from '#models/guide_section'

export default class GuideSectionDto extends BaseModelDto {
  declare id: number
  declare title: string
  declare content: string
  declare order: number
  declare guideId: number
  declare createdAt: string
  declare updatedAt: string

  constructor(guideSection?: GuideSection) {
    super()

    if (!guideSection) return
    this.id = guideSection.id
    this.title = guideSection.title
    this.content = guideSection.content
    this.order = guideSection.order
    this.guideId = guideSection.guideId
    this.createdAt = guideSection.createdAt.toISO()!
    this.updatedAt = guideSection.updatedAt.toISO()!
  }
}
