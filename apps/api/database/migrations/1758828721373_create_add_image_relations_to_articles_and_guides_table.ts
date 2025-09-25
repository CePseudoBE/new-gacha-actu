import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('articles', (table) => {
      table.integer('image_id').unsigned().nullable().references('id').inTable('images').onDelete('SET NULL')
    })

    this.schema.alterTable('guides', (table) => {
      table.integer('image_id').unsigned().nullable().references('id').inTable('images').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable('articles', (table) => {
      table.dropForeign(['image_id'])
      table.dropColumn('image_id')
    })

    this.schema.alterTable('guides', (table) => {
      table.dropForeign(['image_id'])
      table.dropColumn('image_id')
    })
  }
}