import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tag from '#models/tag'

export default class extends BaseSeeder {
  async run() {
    await Tag.updateOrCreateMany('name', [
      { name: 'Tier List' },
      { name: 'Nouveauté' },
      { name: 'Événement' },
      { name: 'Guide Débutant' },
      { name: 'Build Optimal' },
      { name: 'Meta' },
      { name: 'Reroll' },
      { name: 'Bannière' },
      { name: 'Personnage' },
      { name: 'Arme' },
      { name: 'Artifact' },
      { name: 'Team Comp' },
      { name: 'F2P Friendly' },
      { name: 'Mise à jour' },
      { name: 'Patch Notes' },
      { name: 'Optimisation' },
      { name: 'Stratégie' },
      { name: 'PvP' },
      { name: 'PvE' },
      { name: 'End Game' },
    ])
  }
}
