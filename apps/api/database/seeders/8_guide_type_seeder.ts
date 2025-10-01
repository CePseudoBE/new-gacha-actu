import { BaseSeeder } from '@adonisjs/lucid/seeders'
import GuideType from '#models/guide_type'

export default class extends BaseSeeder {
  async run() {
    await GuideType.updateOrCreateMany('name', [
      {
        name: 'Débutant',
        description: 'Guides pour bien débuter dans le jeu',
      },
      {
        name: 'Builds',
        description: 'Optimisation des personnages et équipements',
      },
      {
        name: 'Tier List',
        description: 'Classement des meilleurs personnages',
      },
      {
        name: 'Stratégie',
        description: 'Guides stratégiques avancés',
      },
      {
        name: 'Farming',
        description: 'Optimisation du farm de ressources',
      },
      {
        name: 'End Game',
        description: 'Contenu de fin de jeu',
      },
    ])
  }
}
