import { BaseSeeder } from '@adonisjs/lucid/seeders'
import DifficultyLevel from '#models/difficulty_level'

export default class extends BaseSeeder {
  async run() {
    await DifficultyLevel.updateOrCreateMany('name', [
      {
        name: 'Facile',
        description: 'Pour les débutants',
      },
      {
        name: 'Moyen',
        description: 'Pour les joueurs intermédiaires',
      },
      {
        name: 'Difficile',
        description: 'Pour les joueurs avancés',
      },
      {
        name: 'Expert',
        description: 'Pour les joueurs experts',
      },
    ])
  }
}
