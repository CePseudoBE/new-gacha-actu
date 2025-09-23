import vine from '@vinejs/vine'
import Tag from '#models/tag'
import { DateTime } from 'luxon'
import ArticleDto from '#dtos/article'
import GuideDto from '#dtos/guide'
import GameDto from '#dtos/game'

export const tagValidator = vine.compile(
  vine.object({
    id: vine.number(),
    name: vine.string().trim(),
    slug: vine.string().trim(),
    createdAt: vine.date({ formats: { utc: true } }),
    updatedAt: vine.date({ formats: { utc: true } }),
    articles: vine.array(vine.object({})),
    guides: vine.array(vine.object({})),
    games: vine.array(vine.object({})),
  })
)