import factory from '@adonisjs/lucid/factories'
import Genre from '#models/genre'

export const GenreFactory = factory
  .define(Genre, async ({ faker }) => {
    return {
      name: faker.helpers.arrayElement([
        'RPG',
        'Action RPG',
        'Strategy',
        'Tactical RPG',
        'Gacha',
        'Turn-Based',
        'Real-Time Strategy',
        'Tower Defense',
        'Idle Game',
      ]),
      description: faker.lorem.sentence(),
    }
  })
  .build()
