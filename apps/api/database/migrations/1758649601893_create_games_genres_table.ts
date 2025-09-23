import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'games_genres'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('genre_id').unsigned().references('id').inTable('genres')
      table.integer('game_id').unsigned().references('id').inTable('games')
      table.primary(['genre_id', 'game_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
