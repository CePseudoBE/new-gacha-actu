import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Article from '#models/article'
import Guide from '#models/guide'

export default class SeoKeyword extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare keyword: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @manyToMany(() => Article, {
    pivotTable: 'articles_seo_keywords',
    localKey: 'id',
    pivotForeignKey: 'keyword_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'article_id',
  })
  declare articles: ManyToMany<typeof Article>

  @manyToMany(() => Guide, {
    pivotTable: 'guides_seo_keywords',
    localKey: 'id',
    pivotForeignKey: 'keyword_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'guide_id',
  })
  declare guides: ManyToMany<typeof Guide>
}
