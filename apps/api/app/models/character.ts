import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { slugify } from '@adonisjs/lucid-slugify'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Game from '#models/game'
import Image from '#models/image'
import TierListEntry from '#models/tier_list_entry'

export default class Character extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare gameId: number

  @column()
  declare name: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['name'],
  })
  declare slug: string

  @column()
  declare rarity: string | null

  @column()
  declare element: string | null

  @column()
  declare role: string | null

  @column()
  declare imageId: number | null

  @column()
  declare description: string | null

  @column.date()
  declare releaseDate: DateTime | null

  @column()
  declare isLimited: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => Game, {
    foreignKey: 'gameId',
  })
  declare game: BelongsTo<typeof Game>

  @belongsTo(() => Image, {
    foreignKey: 'imageId',
  })
  declare image: BelongsTo<typeof Image>

  @hasMany(() => TierListEntry, {
    foreignKey: 'characterId',
  })
  declare tierListEntries: HasMany<typeof TierListEntry>
}
