import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import YoutubeVideoService from '#services/youtube_video_service'
import ResponseService from '#services/response_service'
import {
  createYoutubeVideoValidator,
  updateYoutubeVideoValidator,
  youtubeVideoParamsValidator,
} from '#validators/youtube_video'
import { limitValidator } from '#validators/common'

@inject()
export default class YoutubeVideosController {
  constructor(private youtubeVideoService: YoutubeVideoService) {}

  async index(ctx: HttpContext) {
    const videos = await this.youtubeVideoService.getAllVideos()
    ResponseService.ok(ctx, videos)
  }

  async active(ctx: HttpContext) {
    const query = await ctx.request.validateUsing(limitValidator)
    const limit = query.limit || 10
    const videos = await this.youtubeVideoService.getActiveVideos(limit)
    ResponseService.ok(ctx, videos)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(youtubeVideoParamsValidator)
    const video = await this.youtubeVideoService.getVideoById(validatedParams.id)
    ResponseService.ok(ctx, video)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createYoutubeVideoValidator)

    const videoData = {
      ...payload,
      publishedAt: payload.publishedAt ? DateTime.fromJSDate(payload.publishedAt) : undefined,
    }

    const video = await this.youtubeVideoService.createVideo(videoData)
    ResponseService.created(ctx, video, 'Vidéo créée avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } = await ctx.request.validateUsing(
      updateYoutubeVideoValidator
    )

    const videoData = {
      ...payload,
      publishedAt: payload.publishedAt ? DateTime.fromJSDate(payload.publishedAt) : undefined,
    }

    const video = await this.youtubeVideoService.updateVideo(validatedParams.id, videoData)
    ResponseService.ok(ctx, video, 'Vidéo mise à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(youtubeVideoParamsValidator)
    await this.youtubeVideoService.deleteVideo(validatedParams.id)
    ResponseService.success(ctx, 'Vidéo supprimée avec succès')
  }
}
