import factory from '@adonisjs/lucid/factories'
import Guide from '#models/guide'
import { DateTime } from 'luxon'

export const GuideFactory = factory
  .define(Guide, async ({ faker }) => {
    return {
      title: faker.lorem.sentence({ min: 5, max: 10 }),
      summary: faker.lorem.paragraph(2),
      author: faker.person.fullName(),
      publishedAt: DateTime.fromJSDate(
        faker.date.between({ from: '2024-01-01', to: '2025-01-01' })
      ),
      imageUrl: faker.image.url(),
      readingTime: faker.number.int({ min: 5, max: 20 }),
      isPopular: faker.datatype.boolean({ probability: 0.25 }),
      viewCount: faker.number.int({ min: 100, max: 10000 }),
      metaDescription: faker.lorem.sentence(),
      gameId: 1, // Will be overridden by seeder
      guideTypeId: 1, // Will be overridden by seeder
      difficultyId: 1, // Will be overridden by seeder
    }
  })
  .build()
