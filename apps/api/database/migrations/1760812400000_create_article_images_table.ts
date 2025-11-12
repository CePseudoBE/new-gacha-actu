import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'article_images'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('article_id').unsigned().references('id').inTable('articles').onDelete('CASCADE')
      table.integer('image_id').unsigned().references('id').inTable('images').onDelete('CASCADE')
      table.primary(['article_id', 'image_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
