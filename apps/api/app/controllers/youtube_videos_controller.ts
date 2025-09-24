import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import YoutubeVideoService from '#services/youtube_video_service'
import QueryValidationService from '#services/query_validation_service'
import {
  createYoutubeVideoValidator,
  updateYoutubeVideoValidator,
  youtubeVideoParamsValidator,
} from '#validators/youtube_video'

@inject()
export default class YoutubeVideosController {
  constructor(private youtubeVideoService: YoutubeVideoService) {}

  async index(ctx: HttpContext) {
    const videos = await this.youtubeVideoService.getAllVideos()

    return ctx.response.ok({
      success: true,
      data: videos,
    })
  }

  async active(ctx: HttpContext) {
    const { limit } = await QueryValidationService.validateLimit(ctx)
    const videos = await this.youtubeVideoService.getActiveVideos(limit)

    return ctx.response.ok({
      success: true,
      data: videos,
    })
  }

  async show({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(youtubeVideoParamsValidator)
    const video = await this.youtubeVideoService.getVideoById(validatedParams.id)

    if (!video) {
      return response.notFound({
        success: false,
        error: 'Vidéo non trouvée',
      })
    }

    return response.ok({
      success: true,
      data: video,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createYoutubeVideoValidator)

    const videoData = {
      ...payload,
      publishedAt: payload.publishedAt ? DateTime.fromJSDate(payload.publishedAt) : undefined,
    }

    const video = await this.youtubeVideoService.createVideo(videoData)

    return response.created({
      success: true,
      data: video,
      message: 'Vidéo créée avec succès',
    })
  }

  async update({ request, response }: HttpContext) {
    const { params: validatedParams, ...payload } = await request.validateUsing(
      updateYoutubeVideoValidator
    )

    const videoData = {
      ...payload,
      publishedAt: payload.publishedAt ? DateTime.fromJSDate(payload.publishedAt) : undefined,
    }

    const video = await this.youtubeVideoService.updateVideo(validatedParams.id, videoData)

    return response.ok({
      success: true,
      data: video,
      message: 'Vidéo mise à jour avec succès',
    })
  }

  async destroy({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(youtubeVideoParamsValidator)
    await this.youtubeVideoService.deleteVideo(validatedParams.id)

    return response.ok({
      success: true,
      message: 'Vidéo supprimée avec succès',
    })
  }
}
