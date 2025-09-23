import { BaseModelDto } from '@adocasts.com/dto/base'
import Guide from '#models/guide'
import GameDto from '#dtos/game'
import GuideTypeDto from '#dtos/guide_type'
import DifficultyLevelDto from '#dtos/difficulty_level'
import GuideSectionDto from '#dtos/guide_section'
import GuidePrerequisiteDto from '#dtos/guide_prerequisite'
import TagDto from '#dtos/tag'
import SeoKeywordDto from '#dtos/seo_keyword'

export default class GuideDto extends BaseModelDto {
  declare id: number
  declare title: string
  declare summary: string
  declare author: string
  declare publishedAt: string
  declare slug: string
  declare imageUrl: string | null
  declare readingTime: number | null
  declare difficultyId: number
  declare guideTypeId: number
  declare isPopular: boolean
  declare viewCount: number
  declare gameId: number
  declare metaDescription: string | null
  declare createdAt: string
  declare updatedAt: string
  declare game: GameDto | null
  declare guideType: GuideTypeDto | null
  declare difficulty: DifficultyLevelDto | null
  declare sections: GuideSectionDto[]
  declare prerequisites: GuidePrerequisiteDto[]
  declare tags: TagDto[]
  declare seoKeywords: SeoKeywordDto[]

  constructor(guide?: Guide) {
    super()

    if (!guide) return
    this.id = guide.id
    this.title = guide.title
    this.summary = guide.summary
    this.author = guide.author
    this.publishedAt = guide.publishedAt.toISO()!
    this.slug = guide.slug
    this.imageUrl = guide.imageUrl
    this.readingTime = guide.readingTime
    this.difficultyId = guide.difficultyId
    this.guideTypeId = guide.guideTypeId
    this.isPopular = guide.isPopular
    this.viewCount = guide.viewCount
    this.gameId = guide.gameId
    this.metaDescription = guide.metaDescription
    this.createdAt = guide.createdAt.toISO()!
    this.updatedAt = guide.updatedAt.toISO()!
    this.game = guide.game && new GameDto(guide.game)
    this.guideType = guide.guideType && new GuideTypeDto(guide.guideType)
    this.difficulty = guide.difficulty && new DifficultyLevelDto(guide.difficulty)
    this.sections = GuideSectionDto.fromArray(guide.sections)
    this.prerequisites = GuidePrerequisiteDto.fromArray(guide.prerequisites)
    this.tags = TagDto.fromArray(guide.tags)
    this.seoKeywords = SeoKeywordDto.fromArray(guide.seoKeywords)
  }
}
