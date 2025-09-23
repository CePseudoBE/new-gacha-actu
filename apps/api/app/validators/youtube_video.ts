import vine from '@vinejs/vine'
import YoutubeVideo from '#models/youtube_video'
import { DateTime } from 'luxon'
import GameDto from '#dtos/game'

export const youtubeVideoValidator = vine.compile(
  vine.object({
    id: vine.number(),
    videoId: vine.string().trim(),
    title: vine.string().trim(),
    description: vine.string().trim().optional(),
    thumbnail: vine.string().trim().optional(),
    channelTitle: vine.string().trim().optional(),
    publishedAt: vine.date({ formats: { utc: true } }).optional(),
    category: vine.string().trim().optional(),
    duration: vine.string().trim().optional(),
    viewCount: vine.number(),
    isActive: vine.boolean(),
    order: vine.number(),
    gameId: vine.number().optional(),
    createdAt: vine.date({ formats: { utc: true } }),
    updatedAt: vine.date({ formats: { utc: true } }),
    game: vine.object({}),
  })
)