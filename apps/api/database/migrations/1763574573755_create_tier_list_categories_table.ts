import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tier_list_categories'

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

      table.string('name', 100).notNullable()
      table.string('slug', 120).notNullable()
      table.text('description').nullable()
      table.string('icon', 50).nullable()
      table.integer('order').unsigned().defaultTo(0).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['tier_list_id', 'slug'])
      table.index(['tier_list_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}