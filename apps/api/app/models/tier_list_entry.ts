import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import TierList from '#models/tier_list'
import TierListCategory from '#models/tier_list_category'
import Character from '#models/character'
import Tier from '#models/tier'

export default class TierListEntry extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tierListId: number

  @column()
  declare categoryId: number | null

  @column()
  declare characterId: number

  @column()
  declare tierId: number

  @column()
  declare notes: string | null

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

  @belongsTo(() => TierListCategory, {
    foreignKey: 'categoryId',
  })
  declare category: BelongsTo<typeof TierListCategory>

  @belongsTo(() => Character, {
    foreignKey: 'characterId',
  })
  declare character: BelongsTo<typeof Character>

  @belongsTo(() => Tier, {
    foreignKey: 'tierId',
  })
  declare tier: BelongsTo<typeof Tier>
}
