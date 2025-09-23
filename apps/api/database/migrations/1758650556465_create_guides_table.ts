import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'guides'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('summary').notNullable()
      table.string('author').notNullable()
      table.timestamp('published_at').notNullable()
      table.string('slug').notNullable().unique()
      table.string('image_url').nullable()
      table.integer('reading_time').nullable()
      table.integer('difficulty_id').unsigned().notNullable().references('id').inTable('difficulty_levels')
      table.integer('guide_type_id').unsigned().notNullable().references('id').inTable('guide_types')
      table.boolean('is_popular').notNullable().defaultTo(false)
      table.integer('view_count').notNullable().defaultTo(0)
      table.integer('game_id').unsigned().notNullable().references('id').inTable('games')
      table.text('meta_description').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}