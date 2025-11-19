import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tier_list_entries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('tier_list_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tier_lists')
        .onDelete('CASCADE')

      table
        .integer('category_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('tier_list_categories')
        .onDelete('CASCADE')

      table
        .integer('character_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('characters')
        .onDelete('CASCADE')

      table
        .integer('tier_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tiers')
        .onDelete('RESTRICT')

      table.text('notes').nullable()
      table.integer('order').unsigned().defaultTo(0).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['tier_list_id', 'category_id', 'character_id'])
      table.index(['tier_list_id'])
      table.index(['character_id'])
      table.index(['tier_id'])
      table.index(['category_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
