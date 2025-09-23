import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'articles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('summary').notNullable()
      table.string('author').notNullable()
      table.timestamp('published_at').notNullable()
      table.string('slug').notNullable().unique()
      table.string('image_url').nullable()
      table.text('content').notNullable()
      table.text('meta_description').nullable()
      table.integer('reading_time').nullable()
      table.integer('category_id').unsigned().nullable().references('id').inTable('article_categories')
      table.boolean('is_popular').notNullable().defaultTo(false)
      table.integer('game_id').unsigned().notNullable().references('id').inTable('games')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}