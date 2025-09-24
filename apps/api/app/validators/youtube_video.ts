import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

export const createYoutubeVideoValidator = vine.compile(
  vine.object({
    videoId: vine
      .string()
      .trim()
      .minLength(1)
      .unique({ table: 'youtube_videos', column: 'video_id' }),

    title: vine.string().trim().minLength(1).maxLength(200),

    description: vine.string().trim().optional(),

    thumbnail: vine.string().trim().url().optional(),

    channelTitle: vine.string().trim().optional(),

    publishedAt: vine
      .date({
        formats: {
          utc: true,
        },
      })
      .optional(),

    category: vine.string().trim().optional(),

    duration: vine.string().trim().optional(),

    viewCount: vine.number().min(0).optional(),

    isActive: vine.boolean().optional(),

    order: vine.number().min(0).optional(),

    gameId: vine.number().min(1).exists({ table: 'games', column: 'id' }).optional(),
  })
)

const updateYoutubeVideoValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'youtube_videos', column: 'id' }),
    }),

    title: vine.string().trim().minLength(1).maxLength(200).optional(),

    description: vine.string().trim().optional(),

    thumbnail: vine.string().trim().url().optional().nullable(),

    channelTitle: vine.string().trim().optional(),

    publishedAt: vine
      .date({
        formats: {
          utc: true,
        },
      })
      .optional(),

    category: vine.string().trim().optional(),

    duration: vine.string().trim().optional(),

    viewCount: vine.number().min(0).optional(),

    isActive: vine.boolean().optional(),

    order: vine.number().min(0).optional(),

    gameId: vine.number().min(1).exists({ table: 'games', column: 'id' }).optional(),
  })
)

updateYoutubeVideoValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateYoutubeVideoValidator = updateYoutubeVideoValidatorBase

const youtubeVideoParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'youtube_videos', column: 'id' }),
    }),
  })
)

youtubeVideoParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const youtubeVideoParamsValidator = youtubeVideoParamsValidatorBase
