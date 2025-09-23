import vine from '@vinejs/vine'
import GuidePrerequisite from '#models/guide_prerequisite'
import { DateTime } from 'luxon'
import GuideDto from '#dtos/guide'

export const guidePrerequisiteValidator = vine.compile(
  vine.object({
    id: vine.number(),
    description: vine.string().trim(),
    guideId: vine.number(),
    createdAt: vine.date({ formats: { utc: true } }),
    updatedAt: vine.date({ formats: { utc: true } }),
    guide: vine.object({}),
  })
)