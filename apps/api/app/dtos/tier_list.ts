import { BaseModelDto } from '@adocasts.com/dto/base'
import TierList from '#models/tier_list'
import GameDto from '#dtos/game'
import UserDto from '#dtos/user'
import ImageDto from '#dtos/image'
import TierListCategoryDto from '#dtos/tier_list_category'
import TierListEntryDto from '#dtos/tier_list_entry'

export default class TierListDto extends BaseModelDto {
  declare id: number
  declare gameId: number
  declare title: string
  declare slug: string
  declare description: string | null
  declare version: string | null
  declare authorId: number
  declare imageId: number | null
  declare isPublished: boolean
  declare views: number
  declare createdAt: string
  declare updatedAt: string
  declare game: GameDto | null
  declare author: UserDto | null
  declare image: ImageDto | null
  declare categories: TierListCategoryDto[]
  declare entries: TierListEntryDto[]

  constructor(tierList?: TierList) {
    super()

    if (!tierList) return
    this.id = tierList.id
    this.gameId = tierList.gameId
    this.title = tierList.title
    this.slug = tierList.slug
    this.description = tierList.description
    this.version = tierList.version
    this.authorId = tierList.authorId
    this.imageId = tierList.imageId
    this.isPublished = tierList.isPublished
    this.views = tierList.views
    this.createdAt = tierList.createdAt.toISO()!
    this.updatedAt = tierList.updatedAt.toISO()!
    this.game = tierList.game !== undefined ? new GameDto(tierList.game) : null
    this.author = tierList.author !== undefined ? new UserDto(tierList.author) : null
    this.image = tierList.image !== undefined ? new ImageDto(tierList.image) : null
    this.categories =
      tierList.categories !== undefined
        ? TierListCategoryDto.fromArray(tierList.categories)
        : []
    this.entries =
      tierList.entries !== undefined ? TierListEntryDto.fromArray(tierList.entries) : []
  }
}
