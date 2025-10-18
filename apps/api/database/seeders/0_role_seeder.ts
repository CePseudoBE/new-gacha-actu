import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    await Role.updateOrCreateMany('slug', [
      {
        name: 'Admin',
        slug: 'admin',
        description: 'Administrateur avec tous les droits',
      },
      {
        name: 'Éditeur',
        slug: 'editor',
        description: 'Éditeur avec droits de création et modification de contenu',
      },
      {
        name: 'Utilisateur',
        slug: 'user',
        description: 'Utilisateur standard avec droits limités',
      },
    ])
  }
}