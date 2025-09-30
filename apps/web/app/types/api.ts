/**
 * Types basés sur les modèles AdonisJS backend
 * Correspondent aux modèles dans gacha-actu/apps/api/app/models
 */

export interface Article {
  id: number
  title: string
  summary: string
  author: string
  publishedAt: string // DateTime serialized
  slug: string
  imageUrl: string | null
  imageId: number | null
  content: string
  metaDescription: string | null
  readingTime: number | null
  categoryId: number | null
  isPopular: boolean
  gameId: number
  createdAt: string
  updatedAt: string
  // Relations
  game?: Game
  category?: ArticleCategory
  tags?: Tag[]
  seoKeywords?: SeoKeyword[]
}

export interface Game {
  id: number
  name: string
  slug: string
  description: string
  releaseDate: string // DateTime serialized
  isPopular: boolean
  officialSite: string | null
  wiki: string | null
  imageId: number | null
  imageUrl?: string | null // For frontend convenience (computed from image relation)
  createdAt: string
  updatedAt: string
  // Relations
  image?: Image
  articles?: Article[]
  guides?: Guide[]
  youtubeVideos?: YoutubeVideo[]
  genres?: Genre[]
  tags?: Tag[]
  platforms?: Platform[]
}

export interface ArticleCategory {
  id: number
  name: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface SeoKeyword {
  id: number
  keyword: string
  createdAt: string
  updatedAt: string
}

export interface Image {
  id: number
  url: string
  altText: string | null
  width: number | null
  height: number | null
  createdAt: string
  updatedAt: string
}

export interface YoutubeVideo {
  id: number
  videoId: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  publishedAt: string // DateTime serialized
  gameId: number | null
  createdAt: string
  updatedAt: string
  // Relations
  game?: Game
}

export interface Guide {
  id: number
  title: string
  summary: string
  author: string
  publishedAt: string
  slug: string
  imageUrl: string | null
  imageId: number | null
  content: string
  metaDescription: string | null
  readingTime: number | null
  difficultyId: number | null
  typeId: number | null
  isPopular: boolean
  gameId: number
  createdAt: string
  updatedAt: string
  // Relations
  game?: Game
  difficulty?: DifficultyLevel
  type?: GuideType
  sections?: GuideSection[]
  tags?: Tag[]
  prerequisites?: GuidePrerequisite[]
}

export interface DifficultyLevel {
  id: number
  name: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface GuideType {
  id: number
  name: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface GuideSection {
  id: number
  guideId: number
  title: string
  content: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface GuidePrerequisite {
  id: number
  guideId: number
  prerequisiteGuideId: number
  createdAt: string
  updatedAt: string
}

export interface Genre {
  id: number
  name: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface Platform {
  id: number
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  email: string
  fullName: string | null
  createdAt: string
  updatedAt: string
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    perPage?: number
    lastPage?: number
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
