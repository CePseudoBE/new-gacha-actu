import { inject } from '@adonisjs/core'
import YoutubeVideoRepository, {
  YoutubeVideoCreateData,
  YoutubeVideoUpdateData,
} from '#repositories/youtube_video_repository'
import YoutubeVideoDto from '#dtos/youtube_video'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'

@inject()
export default class YoutubeVideoService {
  constructor(private youtubeVideoRepository: YoutubeVideoRepository) {}

  async getActiveVideos(limit: number = 9): Promise<YoutubeVideoDto[]> {
    if (limit < 1 || limit > 20) limit = 9

    return cache.getOrSet({
      key: CacheService.KEYS.YOUTUBE_VIDEOS_ACTIVE,
      ttl: CacheService.TTL.MEDIUM,
      factory: async () => {
        const videos = await this.youtubeVideoRepository.findActive(limit)
        return YoutubeVideoDto.fromArray(videos)
      },
    })
  }

  async getAllVideos(): Promise<YoutubeVideoDto[]> {
    const videos = await this.youtubeVideoRepository.findAll()
    return YoutubeVideoDto.fromArray(videos)
  }

  async getVideoById(id: number): Promise<YoutubeVideoDto | null> {
    const video = await this.youtubeVideoRepository.findById(id)
    return video ? new YoutubeVideoDto(video) : null
  }

  async createVideo(data: YoutubeVideoCreateData): Promise<YoutubeVideoDto> {
    const video = await this.youtubeVideoRepository.create(data)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.YOUTUBE_VIDEOS_ACTIVE })

    return new YoutubeVideoDto(video)
  }

  async updateVideo(id: number, data: YoutubeVideoUpdateData): Promise<YoutubeVideoDto> {
    const updatedVideo = await this.youtubeVideoRepository.update(id, data)
    if (!updatedVideo) {
      throw new Error('Video not found')
    }

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.YOUTUBE_VIDEOS_ACTIVE })

    return new YoutubeVideoDto(updatedVideo)
  }

  async deleteVideo(id: number): Promise<void> {
    await this.youtubeVideoRepository.delete(id)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.YOUTUBE_VIDEOS_ACTIVE })
  }
}
