import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Genre from '#models/genre'

export default class extends BaseSeeder {
  async run() {
    await Genre.updateOrCreateMany('name', [
      {
        name: 'RPG',
        description: 'Jeux de rôle avec progression de personnages et histoire immersive',
      },
      {
        name: 'Action RPG',
        description: 'RPG avec système de combat en temps réel et action dynamique',
      },
      {
        name: 'Strategy',
        description: 'Jeux nécessitant réflexion tactique et planification stratégique',
      },
      {
        name: 'Tactical RPG',
        description: 'RPG au tour par tour avec positionnement stratégique',
      },
      {
        name: 'Gacha',
        description: 'Système de collection de personnages via invocations aléatoires',
      },
      {
        name: 'Turn-Based',
        description: 'Combat au tour par tour avec planification des actions',
      },
      {
        name: 'Tower Defense',
        description: 'Défense de territoire contre des vagues d\'ennemis',
      },
      {
        name: 'Idle Game',
        description: 'Progression automatique avec optimisation des ressources',
      },
    ])
  }
}
