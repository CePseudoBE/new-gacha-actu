import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { slugify } from '@adonisjs/lucid-slugify'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Game from '#models/game'
import User from '#models/user'
import Image from '#models/image'
import TierListCategory from '#models/tier_list_category'
import TierListEntry from '#models/tier_list_entry'

export default class TierList extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare gameId: number

  @column()
  declare title: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['title'],
  })
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare version: string | null

  @column()
  declare authorId: number

  @column()
  declare imageId: number | null

  @column()
  declare isPublished: boolean

  @column()
  declare views: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => Game, {
    foreignKey: 'gameId',
  })
  declare game: BelongsTo<typeof Game>

  @belongsTo(() => User, {
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof User>

  @belongsTo(() => Image, {
    foreignKey: 'imageId',
  })
  declare image: BelongsTo<typeof Image>

  @hasMany(() => TierListCategory, {
    foreignKey: 'tierListId',
  })
  declare categories: HasMany<typeof TierListCategory>

  @hasMany(() => TierListEntry, {
    foreignKey: 'tierListId',
  })
  declare entries: HasMany<typeof TierListEntry>
}
