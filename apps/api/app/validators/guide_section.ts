import vine from '@vinejs/vine'
import GuideSection from '#models/guide_section'
import { DateTime } from 'luxon'
import GuideDto from '#dtos/guide'

export const guideSectionValidator = vine.compile(
  vine.object({
    id: vine.number(),
    title: vine.string().trim(),
    content: vine.string().trim(),
    order: vine.number(),
    guideId: vine.number(),
    createdAt: vine.date({ formats: { utc: true } }),
    updatedAt: vine.date({ formats: { utc: true } }),
    guide: vine.object({}),
  })
)