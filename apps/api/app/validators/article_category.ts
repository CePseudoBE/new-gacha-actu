import vine from '@vinejs/vine'
import ArticleCategory from '#models/article_category'
import { DateTime } from 'luxon'
import ArticleDto from '#dtos/article'

export const articleCategoryValidator = vine.compile(
  vine.object({
    id: vine.number(),
    name: vine.string().trim(),
    slug: vine.string().trim(),
    description: vine.string().trim().optional(),
    createdAt: vine.date({ formats: { utc: true } }),
    updatedAt: vine.date({ formats: { utc: true } }),
    articles: vine.array(vine.object({})),
  })
)