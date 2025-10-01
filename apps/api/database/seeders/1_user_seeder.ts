import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('email', [
      {
        email: 'admin@animegachapulse.com',
        fullName: 'Admin Gacha Pulse',
        password: 'admin123', // Will be hashed by model
      },
      {
        email: 'editor@animegachapulse.com',
        fullName: 'Éditeur Principal',
        password: 'editor123',
      },
    ])
  }
}
