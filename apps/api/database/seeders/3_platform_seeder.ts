import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Platform from '#models/platform'

export default class extends BaseSeeder {
  async run() {
    await Platform.updateOrCreateMany('name', [
      { name: 'iOS' },
      { name: 'Android' },
      { name: 'PC' },
      { name: 'PlayStation 5' },
      { name: 'PlayStation 4' },
      { name: 'Nintendo Switch' },
      { name: 'Xbox Series X/S' },
      { name: 'Xbox One' },
    ])
  }
}
