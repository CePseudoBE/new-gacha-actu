import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'guides'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Drop obsolete image_url column (replaced by image_id foreign key)
      table.dropColumn('image_url')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Restore image_url column if rollback needed
      table.string('image_url').nullable()
    })
  }
}