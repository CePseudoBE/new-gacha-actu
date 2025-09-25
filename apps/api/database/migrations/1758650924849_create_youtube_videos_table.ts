import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'youtube_videos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('video_id').notNullable().unique()
      table.string('title').notNullable()
      table.text('description').nullable()
      table.string('thumbnail').nullable()
      table.string('channel_title').nullable()
      table.timestamp('published_at').nullable()
      table.string('category').nullable()
      table.string('duration').nullable()
      table.integer('view_count').notNullable().defaultTo(0)
      table.boolean('is_active').notNullable().defaultTo(true)
      table.integer('order').notNullable().defaultTo(0)
      table.integer('game_id').unsigned().nullable().references('id').inTable('games')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
