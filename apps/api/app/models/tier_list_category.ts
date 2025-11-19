import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { slugify } from '@adonisjs/lucid-slugify'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import TierList from '#models/tier_list'
import TierListEntry from '#models/tier_list_entry'

export default class TierListCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tierListId: number

  @column()
  declare name: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['name'],
  })
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare icon: string | null

  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => TierList, {
    foreignKey: 'tierListId',
  })
  declare tierList: BelongsTo<typeof TierList>

  @hasMany(() => TierListEntry, {
    foreignKey: 'categoryId',
  })
  declare entries: HasMany<typeof TierListEntry>
}
