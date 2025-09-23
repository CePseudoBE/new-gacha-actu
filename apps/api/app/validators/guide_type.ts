import vine from '@vinejs/vine'
import GuideType from '#models/guide_type'
import { DateTime } from 'luxon'
import GuideDto from '#dtos/guide'

export const guideTypeValidator = vine.compile(
  vine.object({
    id: vine.number(),
    name: vine.string().trim(),
    slug: vine.string().trim(),
    description: vine.string().trim().optional(),
    createdAt: vine.date({ formats: { utc: true } }),
    updatedAt: vine.date({ formats: { utc: true } }),
    guides: vine.array(vine.object({})),
  })
)