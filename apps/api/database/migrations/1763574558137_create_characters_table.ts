import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'characters'

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

      table.string('name', 100).notNullable()
      table.string('slug', 120).notNullable()
      table.string('rarity', 20).nullable()
      table.string('element', 50).nullable()
      table.string('role', 50).nullable()

      table
        .integer('image_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('images')
        .onDelete('SET NULL')

      table.text('description').nullable()
      table.date('release_date').nullable()
      table.boolean('is_limited').defaultTo(false).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['game_id', 'slug'])
      table.index(['game_id'])
      table.index(['slug'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
