import vine from '@vinejs/vine'
import Genre from '#models/genre'
import { DateTime } from 'luxon'
import GameDto from '#dtos/game'

export const genreValidator = vine.compile(
  vine.object({
    id: vine.number(),
    name: vine.string().trim(),
    slug: vine.string().trim(),
    description: vine.string().trim(),
    createdAt: vine.date({ formats: { utc: true } }),
    updatedAt: vine.date({ formats: { utc: true } }),
    games: vine.array(vine.object({})),
  })
)