import YoutubeVideo from '#models/youtube_video'
import { DateTime } from 'luxon'

export interface YoutubeVideoCreateData {
  videoId: string
  title: string
  description?: string
  thumbnail?: string
  channelTitle?: string
  publishedAt?: DateTime
  category?: string
  duration?: string
  viewCount?: number
  isActive?: boolean
  order?: number
  gameId?: number
}

export interface YoutubeVideoUpdateData extends Partial<Omit<YoutubeVideoCreateData, 'videoId' | 'thumbnail' | 'description' | 'channelTitle' | 'category' | 'duration'>> {
  thumbnail?: string | null
  description?: string | null
  channelTitle?: string | null
  category?: string | null
  duration?: string | null
}

export default class YoutubeVideoRepository {
  async findActive(limit: number = 9): Promise<YoutubeVideo[]> {
    return YoutubeVideo.query()
      .where('isActive', true)
      .preload('game', (gameQuery) => {
        gameQuery.select(['id', 'name', 'slug'])
      })
      .orderBy([
        { column: 'order', order: 'asc' },
        { column: 'published_at', order: 'desc' },
        { column: 'created_at', order: 'desc' },
      ])
      .limit(limit)
  }

  async findAll(): Promise<YoutubeVideo[]> {
    return YoutubeVideo.query()
      .preload('game', (gameQuery) => {
        gameQuery.select(['id', 'name', 'slug'])
      })
      .orderBy([
        { column: 'order', order: 'asc' },
        { column: 'created_at', order: 'desc' },
      ])
  }

  async findById(id: number): Promise<YoutubeVideo | null> {
    return YoutubeVideo.query()
      .where('id', id)
      .preload('game', (gameQuery) => {
        gameQuery.select(['id', 'name', 'slug'])
      })
      .first()
  }

  async findByVideoId(videoId: string): Promise<YoutubeVideo | null> {
    return YoutubeVideo.query().where('videoId', videoId).first()
  }

  async create(data: YoutubeVideoCreateData): Promise<YoutubeVideo> {
    const video = await YoutubeVideo.create({
      videoId: data.videoId,
      title: data.title,
      description: data.description || null,
      thumbnail: data.thumbnail || null,
      channelTitle: data.channelTitle || null,
      publishedAt: data.publishedAt || null,
      category: data.category || null,
      duration: data.duration || null,
      viewCount: data.viewCount || 0,
      isActive: data.isActive ?? true,
      order: data.order || 0,
      gameId: data.gameId || null,
    })

    if (video.gameId) {
      await video.load('game')
    }
    return video
  }

  async update(id: number, data: YoutubeVideoUpdateData): Promise<YoutubeVideo | null> {
    const video = await YoutubeVideo.find(id)
    if (!video) return null

    const gameIdChanged = data.gameId !== undefined && data.gameId !== video.gameId

    const updateData = Object.fromEntries(
      Object.entries({
        videoId: data.videoId,
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        channelTitle: data.channelTitle,
        publishedAt: data.publishedAt,
        category: data.category,
        duration: data.duration,
        viewCount: data.viewCount,
        isActive: data.isActive,
        order: data.order,
        gameId: data.gameId,
      }).filter(([, value]) => value !== undefined)
    )

    video.merge(updateData)
    await video.save()

    if (gameIdChanged || video.gameId) {
      await video.load('game')
    }
    return video
  }

  async delete(id: number): Promise<boolean> {
    const video = await YoutubeVideo.find(id)
    if (!video) return false

    await video.delete()
    return true
  }
}
