import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import TierListEntry from '#models/tier_list_entry'

export default class Tier extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare label: string

  @column()
  declare color: string

  @column()
  declare order: number

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @hasMany(() => TierListEntry, {
    foreignKey: 'tierId',
  })
  declare entries: HasMany<typeof TierListEntry>
}
