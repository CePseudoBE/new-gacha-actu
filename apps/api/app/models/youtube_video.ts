import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Game from '#models/game'

export default class YoutubeVideo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare videoId: string

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare thumbnail: string | null

  @column()
  declare channelTitle: string | null

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column()
  declare category: string | null

  @column()
  declare duration: string | null

  @column()
  declare viewCount: number

  @column()
  declare isActive: boolean

  @column()
  declare order: number

  @column()
  declare gameId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => Game, {
    foreignKey: 'gameId',
  })
  declare game: BelongsTo<typeof Game>
}
