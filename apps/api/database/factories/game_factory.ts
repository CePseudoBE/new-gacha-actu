import factory from '@adonisjs/lucid/factories'
import Game from '#models/game'
import { DateTime } from 'luxon'

export const GameFactory = factory
  .define(Game, async ({ faker }) => {
    return {
      name: faker.helpers.arrayElement([
        'Genshin Impact',
        'Honkai Star Rail',
        'Fire Emblem Heroes',
        'Arknights',
        'Blue Archive',
        'Epic Seven',
        'Fate/Grand Order',
        'Azur Lane',
        'Guardian Tales',
        'Summoners War',
      ]),
      description: faker.lorem.paragraph(3),
      releaseDate: DateTime.fromJSDate(
        faker.date.between({ from: '2015-01-01', to: '2024-01-01' })
      ),
      isPopular: faker.datatype.boolean({ probability: 0.3 }),
      officialSite: faker.internet.url(),
      wiki: faker.internet.url(),
    }
  })
  .build()
