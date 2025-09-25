import { BaseModelDto } from '@adocasts.com/dto/base'
import YoutubeVideo from '#models/youtube_video'
import GameDto from '#dtos/game'

export default class YoutubeVideoDto extends BaseModelDto {
  declare id: number
  declare videoId: string
  declare title: string
  declare description: string | null
  declare thumbnail: string | null
  declare channelTitle: string | null
  declare publishedAt: string | null
  declare category: string | null
  declare duration: string | null
  declare viewCount: number
  declare isActive: boolean
  declare order: number
  declare gameId: number | null
  declare createdAt: string
  declare updatedAt: string
  declare game: GameDto | null

  constructor(youtubeVideo?: YoutubeVideo) {
    super()

    if (!youtubeVideo) return
    this.id = youtubeVideo.id
    this.videoId = youtubeVideo.videoId
    this.title = youtubeVideo.title
    this.description = youtubeVideo.description
    this.thumbnail = youtubeVideo.thumbnail
    this.channelTitle = youtubeVideo.channelTitle
    this.publishedAt = youtubeVideo.publishedAt?.toISO()!
    this.category = youtubeVideo.category
    this.duration = youtubeVideo.duration
    this.viewCount = youtubeVideo.viewCount
    this.isActive = youtubeVideo.isActive
    this.order = youtubeVideo.order
    this.gameId = youtubeVideo.gameId
    this.createdAt = youtubeVideo.createdAt.toISO()!
    this.updatedAt = youtubeVideo.updatedAt.toISO()!
    this.game = youtubeVideo.game && new GameDto(youtubeVideo.game)
  }
}
