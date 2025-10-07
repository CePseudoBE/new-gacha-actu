import Guide from '#models/guide'
import GuideSection from '#models/guide_section'
import GuidePrerequisite from '#models/guide_prerequisite'
import { DateTime } from 'luxon'

export interface GuideSectionData {
  title: string
  content: string
  order: number
}

export interface GuidePrerequisiteData {
  description: string
}

export interface GuideCreateData {
  title: string
  summary: string
  author: string
  publishedAt: Date
  slug?: string
  imageId?: number
  readingTime?: number | null
  difficultyId: number
  guideTypeId: number
  isPopular?: boolean
  viewCount?: number
  gameId: number
  metaDescription?: string | null
  sections: GuideSectionData[]
  prerequisites?: GuidePrerequisiteData[]
  tagIds?: number[]
  seoKeywordIds?: number[]
}

export interface GuideUpdateData {
  title?: string
  summary?: string
  author?: string
  publishedAt?: Date
  slug?: string
  imageId?: number
  readingTime?: number | null
  difficultyId?: number
  guideTypeId?: number
  isPopular?: boolean
  gameId?: number
  metaDescription?: string | null
  sections?: GuideSectionData[]
  prerequisites?: GuidePrerequisiteData[]
  tagIds?: number[]
  seoKeywordIds?: number[]
}

export interface GuideFilters {
  gameSlug?: string
  guideTypeId?: number
  difficultyId?: number
  isPopular?: boolean
  limit?: number
  page?: number
}

export default class GuideRepository {
  async findAll(): Promise<Guide[]> {
    return Guide.query()
      .preload('game')
      .preload('guideType')
      .preload('difficulty')
      .preload('tags')
      .preload('seoKeywords')
      .preload('image')
      .preload('sections', (query) => {
        query.preload('image').orderBy('order', 'asc')
      })
      .preload('prerequisites')
      .orderBy([
        { column: 'isPopular', order: 'desc' },
        { column: 'publishedAt', order: 'desc' },
      ])
  }

  async findWithFilters(filters: GuideFilters): Promise<{ guides: Guide[]; total: number }> {
    const query = Guide.query()

    // Relations
    if (filters.gameSlug) {
      query.whereHas('game', (gameQuery) => {
        gameQuery.where('slug', filters.gameSlug!)
      })
    }

    if (filters.guideTypeId) {
      query.where('guideTypeId', filters.guideTypeId)
    }

    if (filters.difficultyId) {
      query.where('difficultyId', filters.difficultyId)
    }

    if (filters.isPopular !== undefined) {
      query.where('isPopular', filters.isPopular)
    }

    // Preload relations
    query
      .preload('game')
      .preload('guideType')
      .preload('difficulty')
      .preload('tags')
      .preload('image')
      .preload('sections', (sectionQuery) => {
        sectionQuery.preload('image').orderBy('order', 'asc')
      })

    // Count for pagination
    const countQuery = query.clone()
    const total = await countQuery.count('* as total')
    const totalCount = Number((total[0] as any).total)

    // Pagination
    const page = filters.page || 1
    const limit = filters.limit || 20
    const skip = (page - 1) * limit

    query
      .orderBy([
        { column: 'isPopular', order: 'desc' },
        { column: 'publishedAt', order: 'desc' },
      ])
      .offset(skip)
      .limit(limit)

    const guides = await query

    return { guides, total: totalCount }
  }

  async findById(id: number): Promise<Guide | null> {
    return Guide.query()
      .where('id', id)
      .preload('game')
      .preload('guideType')
      .preload('difficulty')
      .preload('tags')
      .preload('seoKeywords')
      .preload('image')
      .preload('sections', (query) => {
        query.preload('image').orderBy('order', 'asc')
      })
      .preload('prerequisites')
      .first()
  }

  async findBySlug(slug: string): Promise<Guide | null> {
    return Guide.query()
      .where('slug', slug)
      .preload('game')
      .preload('guideType')
      .preload('difficulty')
      .preload('tags')
      .preload('seoKeywords')
      .preload('image')
      .preload('sections', (query) => {
        query.preload('image').orderBy('order', 'asc')
      })
      .preload('prerequisites')
      .first()
  }

  async findPopular(): Promise<Guide[]> {
    return Guide.query()
      .where('isPopular', true)
      .preload('game')
      .preload('guideType')
      .preload('difficulty')
      .preload('tags')
      .preload('seoKeywords')
      .preload('image')
      .preload('sections', (query) => {
        query.preload('image').orderBy('order', 'asc')
      })
      .orderBy('publishedAt', 'desc')
  }

  async findByGame(gameId: number): Promise<Guide[]> {
    return Guide.query()
      .where('gameId', gameId)
      .preload('game')
      .preload('guideType')
      .preload('difficulty')
      .preload('tags')
      .preload('seoKeywords')
      .preload('image')
      .preload('sections', (query) => {
        query.preload('image').orderBy('order', 'asc')
      })
      .orderBy([
        { column: 'isPopular', order: 'desc' },
        { column: 'publishedAt', order: 'desc' },
      ])
  }

  async create(data: GuideCreateData): Promise<Guide> {
    const { sections, prerequisites, tagIds, seoKeywordIds, ...guideData } = data

    const guide = await Guide.create({
      ...guideData,
      publishedAt: DateTime.fromJSDate(data.publishedAt),
      viewCount: data.viewCount || 0,
    })

    // Create sections
    if (sections && sections.length > 0) {
      const sectionsToCreate = sections.map((section, index) => ({
        ...section,
        order: section.order !== undefined ? section.order : index,
        guideId: guide.id,
      }))
      await GuideSection.createMany(sectionsToCreate)
    }

    // Create prerequisites
    if (prerequisites && prerequisites.length > 0) {
      const prerequisitesToCreate = prerequisites.map((prerequisite) => ({
        ...prerequisite,
        guideId: guide.id,
      }))
      await GuidePrerequisite.createMany(prerequisitesToCreate)
    }

    // Attach many-to-many relations
    if (tagIds && tagIds.length > 0) {
      await guide.related('tags').attach(tagIds)
    }

    if (seoKeywordIds && seoKeywordIds.length > 0) {
      await guide.related('seoKeywords').attach(seoKeywordIds)
    }

    return guide
  }

  async update(id: number, data: GuideUpdateData): Promise<Guide | null> {
    const guide = await Guide.find(id)
    if (!guide) {
      return null
    }

    const { sections, prerequisites, tagIds, seoKeywordIds, ...updateData } = data

    const mergeData: any = {
      ...updateData,
    }

    if (data.publishedAt) {
      mergeData.publishedAt = DateTime.fromJSDate(data.publishedAt as Date)
    }

    guide.merge(mergeData)
    await guide.save()

    // Update sections if provided
    if (sections !== undefined) {
      // Delete existing sections
      await GuideSection.query().where('guideId', guide.id).delete()

      // Create new sections
      if (sections.length > 0) {
        const sectionsToCreate = sections.map((section, index) => ({
          ...section,
          order: section.order !== undefined ? section.order : index,
          guideId: guide.id,
        }))
        await GuideSection.createMany(sectionsToCreate)
      }
    }

    // Update prerequisites if provided
    if (prerequisites !== undefined) {
      // Delete existing prerequisites
      await GuidePrerequisite.query().where('guideId', guide.id).delete()

      // Create new prerequisites
      if (prerequisites.length > 0) {
        const prerequisitesToCreate = prerequisites.map((prerequisite) => ({
          ...prerequisite,
          guideId: guide.id,
        }))
        await GuidePrerequisite.createMany(prerequisitesToCreate)
      }
    }

    // Sync many-to-many relations
    if (tagIds !== undefined) {
      await guide.related('tags').sync(tagIds)
    }

    if (seoKeywordIds !== undefined) {
      await guide.related('seoKeywords').sync(seoKeywordIds)
    }

    return guide
  }

  async incrementViewCount(id: number): Promise<Guide | null> {
    const guide = await Guide.find(id)
    if (!guide) {
      return null
    }

    guide.viewCount = guide.viewCount + 1
    await guide.save()

    return guide
  }

  async delete(id: number): Promise<boolean> {
    const guide = await Guide.find(id)
    if (!guide) {
      return false
    }

    // The cascade delete will handle sections and prerequisites
    await guide.delete()
    return true
  }
}
