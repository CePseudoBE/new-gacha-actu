import vine from '@vinejs/vine'
import Platform from '#models/platform'
import { DateTime } from 'luxon'
import GameDto from '#dtos/game'

export const platformValidator = vine.compile(
  vine.object({
    id: vine.number(),
    name: vine.string().trim(),
    slug: vine.string().trim(),
    color: vine.string().trim().optional(),
    createdAt: vine.date({ formats: { utc: true } }),
    updatedAt: vine.date({ formats: { utc: true } }),
    games: vine.array(vine.object({})),
  })
)