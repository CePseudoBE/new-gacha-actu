import factory from '@adonisjs/lucid/factories'
import ArticleCategory from '#models/article_category'

export const ArticleCategoryFactory = factory
  .define(ArticleCategory, async ({ faker }) => {
    return {
      name: faker.helpers.arrayElement([
        'Actualités',
        'Guides',
        'Tier Lists',
        'Événements',
        'Analyses',
        'Astuces',
      ]),
      description: faker.lorem.sentence(),
    }
  })
  .build()
