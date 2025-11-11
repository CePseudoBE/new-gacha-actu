import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import env from '#start/env'

export default class extends BaseSeeder {
  async run() {
    // Production: Only create admin user with secure password from environment
    const adminEmail = env.get('ADMIN_EMAIL', 'admin@gachapulse.com')
    const adminPassword = env.get('ADMIN_PASSWORD')

    if (!adminPassword) {
      console.warn(
        '⚠️  WARNING: ADMIN_PASSWORD not set in .env. Skipping admin user creation.'
      )
      console.warn('   Set ADMIN_PASSWORD in your .env file to create the admin user.')
      return
    }

    await User.updateOrCreate(
      { email: adminEmail },
      {
        email: adminEmail,
        fullName: 'Administrator',
        password: adminPassword, // Will be hashed by model
      }
    )

    console.log(`✅ Admin user created: ${adminEmail}`)
  }
}
