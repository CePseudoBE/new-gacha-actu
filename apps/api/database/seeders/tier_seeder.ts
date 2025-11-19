import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    // Insert default tiers (S, A, B, C, D, F)
    await db.table('tiers').multiInsert([
      {
        name: 'S',
        label: 'God Tier',
        color: '#FF6B6B',
        order: 1,
        description: 'Les meilleurs personnages du jeu, dominants dans toutes les situations',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'A',
        label: 'Excellent',
        color: '#FFA94D',
        order: 2,
        description: 'Personnages très puissants et polyvalents',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'B',
        label: 'Good',
        color: '#FFD93D',
        order: 3,
        description: 'Personnages solides avec de bonnes performances',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'C',
        label: 'Average',
        color: '#6BCF7F',
        order: 4,
        description: 'Personnages moyens, utilisables mais pas optimaux',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'D',
        label: 'Below Average',
        color: '#4ECDC4',
        order: 5,
        description: 'Personnages faibles, déconseillés sauf pour collection',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'F',
        label: 'Poor',
        color: '#95A5A6',
        order: 6,
        description: 'Les moins performants, à éviter',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  }
}