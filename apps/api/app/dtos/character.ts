import { BaseModelDto } from '@adocasts.com/dto/base'
import Character from '#models/character'
import GameDto from '#dtos/game'
import ImageDto from '#dtos/image'

export default class CharacterDto extends BaseModelDto {
  declare id: number
  declare gameId: number
  declare name: string
  declare slug: string
  declare rarity: string | null
  declare element: string | null
  declare role: string | null
  declare imageId: number | null
  declare description: string | null
  declare releaseDate: string | null
  declare isLimited: boolean
  declare createdAt: string
  declare updatedAt: string
  declare game: GameDto | null
  declare image: ImageDto | null

  constructor(character?: Character) {
    super()

    if (!character) return
    this.id = character.id
    this.gameId = character.gameId
    this.name = character.name
    this.slug = character.slug
    this.rarity = character.rarity
    this.element = character.element
    this.role = character.role
    this.imageId = character.imageId
    this.description = character.description
    this.releaseDate = character.releaseDate?.toISO() ?? null
    this.isLimited = character.isLimited
    this.createdAt = character.createdAt.toISO()!
    this.updatedAt = character.updatedAt.toISO()!
    this.game = character.game !== undefined ? new GameDto(character.game) : null
    this.image = character.image !== undefined ? new ImageDto(character.image) : null
  }
}
