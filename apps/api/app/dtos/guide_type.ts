import { BaseModelDto } from '@adocasts.com/dto/base'
import GuideType from '#models/guide_type'
import GuideDto from '#dtos/guide'

export default class GuideTypeDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare slug: string
  declare description: string | null
  declare createdAt: string
  declare updatedAt: string
  declare guides?: GuideDto[]

  constructor(guideType?: GuideType) {
    super()

    if (!guideType) return
    this.id = guideType.id
    this.name = guideType.name
    this.slug = guideType.slug
    this.description = guideType.description
    this.createdAt = guideType.createdAt.toISO()!
    this.updatedAt = guideType.updatedAt.toISO()!
    if (guideType.guides) {
      this.guides = GuideDto.fromArray(guideType.guides)
    }
  }
}
