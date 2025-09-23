import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { slugify } from '@adonisjs/lucid-slugify'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Article from '#models/article'
import Guide from '#models/guide'
import Genre from '#models/genre'
import Tag from '#models/tag'
import Platform from '#models/platform'
import YoutubeVideo from '#models/youtube_video'

export default class Game extends BaseModel {
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

  @column()
  declare description: string

  @column.dateTime()
  declare releaseDate: DateTime

  @column()
  declare isPopular: boolean

  @column()
  declare officialSite: string | null

  @column()
  declare wiki: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @hasMany(() => Article, {
    foreignKey: 'gameId',
  })
  declare articles: HasMany<typeof Article>

  @hasMany(() => Guide, {
    foreignKey: 'gameId',
  })
  declare guides: HasMany<typeof Guide>

  @hasMany(() => YoutubeVideo, {
    foreignKey: 'gameId',
  })
  declare youtubeVideos: HasMany<typeof YoutubeVideo>

  @manyToMany(() => Genre, {
    pivotTable: 'games_genres',
    localKey: 'id',
    pivotForeignKey: 'game_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'genre_id',
  })
  declare genres: ManyToMany<typeof Genre>

  @manyToMany(() => Tag, {
    pivotTable: 'games_tags',
    localKey: 'id',
    pivotForeignKey: 'game_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare tags: ManyToMany<typeof Tag>

  @manyToMany(() => Platform, {
    pivotTable: 'games_platforms',
    localKey: 'id',
    pivotForeignKey: 'game_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'platform_id',
  })
  declare platforms: ManyToMany<typeof Platform>
}
