import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ArticleCategory from '#models/article_category'

export default class extends BaseSeeder {
  async run() {
    await ArticleCategory.updateOrCreateMany('name', [
      {
        name: 'Actualités',
        description: 'Dernières news et annonces de l\'univers Gacha',
      },
      {
        name: 'Guides',
        description: 'Guides complets et tutoriels pour progresser',
      },
      {
        name: 'Tier Lists',
        description: 'Classements des meilleurs personnages et équipements',
      },
      {
        name: 'Événements',
        description: 'Couverture des événements en cours et à venir',
      },
      {
        name: 'Analyses',
        description: 'Analyses approfondies de mécaniques et stratégies',
      },
      {
        name: 'Astuces',
        description: 'Tips et astuces pour optimiser votre expérience',
      },
    ])
  }
}
