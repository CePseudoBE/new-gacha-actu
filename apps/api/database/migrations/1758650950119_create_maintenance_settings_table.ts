import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'maintenance_settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo('singleton')
      table.boolean('is_enabled').notNullable().defaultTo(false)
      table
        .text('message')
        .notNullable()
        .defaultTo('Site en maintenance. Nous reviendrons bientôt !')
      table.timestamp('estimated_end_time').nullable()
      table.boolean('allow_admin_access').notNullable().defaultTo(true)
      table.string('enabled_by').nullable()
      table.string('disabled_by').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
