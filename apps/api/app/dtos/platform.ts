import { BaseModelDto } from '@adocasts.com/dto/base'
import Platform from '#models/platform'
import GameDto from '#dtos/game'

export default class PlatformDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare slug: string
  declare createdAt: string
  declare updatedAt: string
  declare games: GameDto[]

  constructor(platform?: Platform) {
    super()

    if (!platform) return
    this.id = platform.id
    this.name = platform.name
    this.slug = platform.slug
    this.createdAt = platform.createdAt.toISO()!
    this.updatedAt = platform.updatedAt.toISO()!
    this.games = GameDto.fromArray(platform.games)
  }
}
