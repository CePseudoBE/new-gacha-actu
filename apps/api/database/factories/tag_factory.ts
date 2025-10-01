import factory from '@adonisjs/lucid/factories'
import Tag from '#models/tag'

export const TagFactory = factory
  .define(Tag, async ({ faker }) => {
    return {
      name: faker.helpers.arrayElement([
        'Tier List',
        'Nouveauté',
        'Événement',
        'Guide Débutant',
        'Build Optimal',
        'Meta',
        'Reroll',
        'Bannière',
        'Personnage',
        'Arme',
        'Artifact',
        'Team Comp',
        'F2P Friendly',
        'Mise à jour',
        'Patch Notes',
      ]),
    }
  })
  .build()
