import factory from '@adonisjs/lucid/factories'
import Article from '#models/article'
import { DateTime } from 'luxon'

export const ArticleFactory = factory
  .define(Article, async ({ faker }) => {
    return {
      title: faker.lorem.sentence({ min: 5, max: 10 }),
      summary: faker.lorem.paragraph(2),
      author: faker.person.fullName(),
      publishedAt: DateTime.fromJSDate(
        faker.date.between({ from: '2024-01-01', to: '2025-01-01' })
      ),
      content: faker.lorem.paragraphs(10, '\n\n'),
      metaDescription: faker.lorem.sentence(),
      readingTime: faker.number.int({ min: 3, max: 15 }),
      isPopular: faker.datatype.boolean({ probability: 0.2 }),
      gameId: 1, // Will be overridden by seeder
      categoryId: 1, // Will be overridden by seeder
    }
  })
  .build()
