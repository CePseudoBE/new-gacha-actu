import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import { slugify } from '@adonisjs/lucid-slugify'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Game from '#models/game'
import ArticleCategory from '#models/article_category'
import Tag from '#models/tag'
import SeoKeyword from '#models/seo_keyword'
import Image from '#models/image'

export default class Article extends BaseModel {
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
  declare imageId: number | null

  @column()
  declare content: string

  @column()
  declare metaDescription: string | null

  @column()
  declare readingTime: number | null

  @column()
  declare categoryId: number | null

  @column()
  declare isPopular: boolean

  @column()
  declare gameId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => Game, {
    foreignKey: 'gameId',
  })
  declare game: BelongsTo<typeof Game>

  @belongsTo(() => ArticleCategory, {
    foreignKey: 'categoryId',
  })
  declare category: BelongsTo<typeof ArticleCategory>

  @belongsTo(() => Image, {
    foreignKey: 'imageId',
  })
  declare image: BelongsTo<typeof Image>

  @manyToMany(() => Tag, {
    pivotTable: 'articles_tags',
    localKey: 'id',
    pivotForeignKey: 'article_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare tags: ManyToMany<typeof Tag>

  @manyToMany(() => SeoKeyword, {
    pivotTable: 'articles_seo_keywords',
    localKey: 'id',
    pivotForeignKey: 'article_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'keyword_id',
  })
  declare seoKeywords: ManyToMany<typeof SeoKeyword>

  @manyToMany(() => Image, {
    pivotTable: 'article_images',
    localKey: 'id',
    pivotForeignKey: 'article_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'image_id',
  })
  declare galleryImages: ManyToMany<typeof Image>
}
