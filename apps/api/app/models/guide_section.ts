import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Guide from '#models/guide'
import Image from '#models/image'

export default class GuideSection extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare order: number

  @column()
  declare guideId: number

  @column()
  declare imageId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => Guide, {
    foreignKey: 'guideId',
  })
  declare guide: BelongsTo<typeof Guide>

  @belongsTo(() => Image, {
    foreignKey: 'imageId',
  })
  declare image: BelongsTo<typeof Image>
}
