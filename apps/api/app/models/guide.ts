import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { slugify } from '@adonisjs/lucid-slugify'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Game from '#models/game'
import GuideType from '#models/guide_type'
import DifficultyLevel from '#models/difficulty_level'
import Tag from '#models/tag'
import SeoKeyword from '#models/seo_keyword'
import GuideSection from '#models/guide_section'
import GuidePrerequisite from '#models/guide_prerequisite'

export default class Guide extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare summary: string

  @column()
  declare author: string

  @column.dateTime()
  declare publishedAt: DateTime

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['title'],
  })
  declare slug: string

  @column()
  declare imageUrl: string | null

  @column()
  declare readingTime: number | null

  @column()
  declare difficultyId: number

  @column()
  declare guideTypeId: number

  @column()
  declare isPopular: boolean

  @column()
  declare viewCount: number

  @column()
  declare gameId: number

  @column()
  declare metaDescription: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => Game, {
    foreignKey: 'gameId',
  })
  declare game: BelongsTo<typeof Game>

  @belongsTo(() => GuideType, {
    foreignKey: 'guideTypeId',
  })
  declare guideType: BelongsTo<typeof GuideType>

  @belongsTo(() => DifficultyLevel, {
    foreignKey: 'difficultyId',
  })
  declare difficulty: BelongsTo<typeof DifficultyLevel>

  @hasMany(() => GuideSection, {
    foreignKey: 'guideId',
  })
  declare sections: HasMany<typeof GuideSection>

  @hasMany(() => GuidePrerequisite, {
    foreignKey: 'guideId',
  })
  declare prerequisites: HasMany<typeof GuidePrerequisite>

  @manyToMany(() => Tag, {
    pivotTable: 'guides_tags',
    localKey: 'id',
    pivotForeignKey: 'guide_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare tags: ManyToMany<typeof Tag>

  @manyToMany(() => SeoKeyword, {
    pivotTable: 'guides_seo_keywords',
    localKey: 'id',
    pivotForeignKey: 'guide_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'keyword_id',
  })
  declare seoKeywords: ManyToMany<typeof SeoKeyword>
}
