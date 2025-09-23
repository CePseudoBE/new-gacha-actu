import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'games_platforms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('game_id').unsigned().references('id').inTable('games')
      table.integer('platform_id').unsigned().references('id').inTable('platforms')
      table.primary(['game_id', 'platform_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
