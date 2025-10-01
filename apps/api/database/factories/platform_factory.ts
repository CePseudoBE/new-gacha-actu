import factory from '@adonisjs/lucid/factories'
import Platform from '#models/platform'

export const PlatformFactory = factory
  .define(Platform, async ({ faker }) => {
    return {
      name: faker.helpers.arrayElement([
        'iOS',
        'Android',
        'PC',
        'PlayStation 5',
        'PlayStation 4',
        'Nintendo Switch',
        'Xbox Series X/S',
      ]),
    }
  })
  .build()
