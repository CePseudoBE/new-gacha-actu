import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    // Get roles
    const adminRole = await Role.findByOrFail('slug', 'admin')
    const editorRole = await Role.findByOrFail('slug', 'editor')
    const userRole = await Role.findByOrFail('slug', 'user')

    // Create users
    await User.updateOrCreateMany('email', [
      {
        fullName: 'Admin User',
        email: 'admin@gachaactu.com',
        password: 'admin123456',
        roleId: adminRole.id,
      },
      {
        fullName: 'Éditeur Test',
        email: 'editor@gachaactu.com',
        password: 'editor123456',
        roleId: editorRole.id,
      },
      {
        fullName: 'Utilisateur Test',
        email: 'user@gachaactu.com',
        password: 'user123456',
        roleId: userRole.id,
      },
    ])
  }
}