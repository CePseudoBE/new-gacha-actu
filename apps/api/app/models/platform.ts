import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { slugify } from '@adonisjs/lucid-slugify'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Game from '#models/game'

export default class Platform extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['name'],
  })
  declare slug: string


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @manyToMany(() => Game, {
    pivotTable: 'games_platforms',
    localKey: 'id',
    pivotForeignKey: 'platform_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'game_id',
  })
  declare games: ManyToMany<typeof Game>
}
