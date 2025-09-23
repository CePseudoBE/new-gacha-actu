import vine from '@vinejs/vine'
import SeoKeyword from '#models/seo_keyword'
import { DateTime } from 'luxon'
import ArticleDto from '#dtos/article'
import GuideDto from '#dtos/guide'

export const seoKeywordValidator = vine.compile(
  vine.object({
    id: vine.number(),
    keyword: vine.string().trim(),
    createdAt: vine.date({ formats: { utc: true } }),
    updatedAt: vine.date({ formats: { utc: true } }),
    articles: vine.array(vine.object({})),
    guides: vine.array(vine.object({})),
  })
)