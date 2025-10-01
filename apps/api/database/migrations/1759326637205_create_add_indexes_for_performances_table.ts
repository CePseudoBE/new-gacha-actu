import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Articles indexes
    this.schema.alterTable('articles', (table) => {
      table.index('game_id', 'articles_game_id_index')
      table.index('published_at', 'articles_published_at_index')
      table.index('is_popular', 'articles_is_popular_index')
      table.index(['game_id', 'published_at'], 'articles_game_published_index')
    })

    // Guides indexes
    this.schema.alterTable('guides', (table) => {
      table.index('game_id', 'guides_game_id_index')
      table.index('published_at', 'guides_published_at_index')
      table.index('is_popular', 'guides_is_popular_index')
      table.index('guide_type_id', 'guides_guide_type_id_index')
      table.index('difficulty_id', 'guides_difficulty_id_index')
      table.index(['game_id', 'published_at'], 'guides_game_published_index')
    })

    // Games indexes
    this.schema.alterTable('games', (table) => {
      table.index('is_popular', 'games_is_popular_index')
    })

    // Guide sections indexes
    this.schema.alterTable('guide_sections', (table) => {
      table.index('guide_id', 'guide_sections_guide_id_index')
      table.index(['guide_id', 'order'], 'guide_sections_guide_order_index')
    })

    // YouTube videos indexes
    this.schema.alterTable('youtube_videos', (table) => {
      table.index('game_id', 'youtube_videos_game_id_index')
      table.index('is_active', 'youtube_videos_is_active_index')
    })
  }

  async down() {
    this.schema.alterTable('articles', (table) => {
      table.dropIndex('game_id', 'articles_game_id_index')
      table.dropIndex('published_at', 'articles_published_at_index')
      table.dropIndex('is_popular', 'articles_is_popular_index')
      table.dropIndex(['game_id', 'published_at'], 'articles_game_published_index')
    })

    this.schema.alterTable('guides', (table) => {
      table.dropIndex('game_id', 'guides_game_id_index')
      table.dropIndex('published_at', 'guides_published_at_index')
      table.dropIndex('is_popular', 'guides_is_popular_index')
      table.dropIndex('guide_type_id', 'guides_guide_type_id_index')
      table.dropIndex('difficulty_id', 'guides_difficulty_id_index')
      table.dropIndex(['game_id', 'published_at'], 'guides_game_published_index')
    })

    this.schema.alterTable('games', (table) => {
      table.dropIndex('is_popular', 'games_is_popular_index')
    })

    this.schema.alterTable('guide_sections', (table) => {
      table.dropIndex('guide_id', 'guide_sections_guide_id_index')
      table.dropIndex(['guide_id', 'order'], 'guide_sections_guide_order_index')
    })

    this.schema.alterTable('youtube_videos', (table) => {
      table.dropIndex('game_id', 'youtube_videos_game_id_index')
      table.dropIndex('is_active', 'youtube_videos_is_active_index')
    })
  }
}