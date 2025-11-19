import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tier_lists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('game_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('games')
        .onDelete('CASCADE')

      table.string('title', 200).notNullable()
      table.string('slug', 220).notNullable().unique()
      table.text('description').nullable()
      table.string('version', 50).nullable()

      table
        .integer('author_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('image_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('images')
        .onDelete('SET NULL')

      table.boolean('is_published').defaultTo(false).notNullable()
      table.integer('views').defaultTo(0).unsigned().notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index(['game_id'])
      table.index(['author_id'])
      table.index(['is_published'])
      table.index(['slug'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}