import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'articles_seo_keywords'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('article_id').unsigned().references('id').inTable('articles')
      table.integer('keyword_id').unsigned().references('id').inTable('seo_keywords')
      table.primary(['article_id', 'keyword_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}