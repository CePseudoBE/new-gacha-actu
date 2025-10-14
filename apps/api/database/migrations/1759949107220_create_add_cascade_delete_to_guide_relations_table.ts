import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Add CASCADE delete to guide_sections
    this.schema.alterTable('guide_sections', (table) => {
      table.dropForeign(['guide_id'])
      table
        .integer('guide_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('guides')
        .onDelete('CASCADE')
        .alter()
    })

    // Add CASCADE delete to guide_prerequisites
    this.schema.alterTable('guide_prerequisites', (table) => {
      table.dropForeign(['guide_id'])
      table
        .integer('guide_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('guides')
        .onDelete('CASCADE')
        .alter()
    })

    // Add CASCADE delete to guides_tags pivot table
    this.schema.alterTable('guides_tags', (table) => {
      table.dropForeign(['guide_id'])
      table
        .integer('guide_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('guides')
        .onDelete('CASCADE')
        .alter()
    })

    // Add CASCADE delete to guides_seo_keywords pivot table
    this.schema.alterTable('guides_seo_keywords', (table) => {
      table.dropForeign(['guide_id'])
      table
        .integer('guide_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('guides')
        .onDelete('CASCADE')
        .alter()
    })
  }

  async down() {
    // Revert guide_sections to no cascade
    this.schema.alterTable('guide_sections', (table) => {
      table.dropForeign(['guide_id'])
      table
        .integer('guide_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('guides')
        .alter()
    })

    // Revert guide_prerequisites to no cascade
    this.schema.alterTable('guide_prerequisites', (table) => {
      table.dropForeign(['guide_id'])
      table
        .integer('guide_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('guides')
        .alter()
    })

    // Revert guides_tags to no cascade
    this.schema.alterTable('guides_tags', (table) => {
      table.dropForeign(['guide_id'])
      table
        .integer('guide_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('guides')
        .alter()
    })

    // Revert guides_seo_keywords to no cascade
    this.schema.alterTable('guides_seo_keywords', (table) => {
      table.dropForeign(['guide_id'])
      table
        .integer('guide_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('guides')
        .alter()
    })
  }
}