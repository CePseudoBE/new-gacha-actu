import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'games_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('tag_id').unsigned().references('id').inTable('tags')
      table.integer('game_id').unsigned().references('id').inTable('games')
      table.primary(['game_id', 'tag_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
