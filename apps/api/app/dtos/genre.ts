import { BaseModelDto } from '@adocasts.com/dto/base'
import Genre from '#models/genre'
import GameDto from '#dtos/game'

export default class GenreDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare slug: string
  declare description: string
  declare createdAt: string
  declare updatedAt: string
  declare games: GameDto[]

  constructor(genre?: Genre) {
    super()

    if (!genre) return
    this.id = genre.id
    this.name = genre.name
    this.slug = genre.slug
    this.description = genre.description
    this.createdAt = genre.createdAt.toISO()!
    this.updatedAt = genre.updatedAt.toISO()!
    this.games = GameDto.fromArray(genre.games)
  }
}
