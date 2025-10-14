import { inject } from '@adonisjs/core'
import GuideRepository, {
  GuideCreateData,
  GuideFilters,
  GuideUpdateData,
} from '#repositories/guide_repository'
import GuideDto from '#dtos/guide'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'
import { NotFoundException, BadRequestException } from '#exceptions/http_exceptions'
import ImageService from '#services/image_service'
import { MultipartFile } from '@adonisjs/core/bodyparser'

export interface GuideListResponse {
  guides: GuideDto[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

@inject()
export default class GuideService {
  constructor(
    private guideRepository: GuideRepository,
    private imageService: ImageService
  ) {}

  async getGuides(): Promise<GuideDto[]> {
    return cache.getOrSet({
      key: CacheService.KEYS.GUIDES_ALL,
      ttl: CacheService.TTL.MEDIUM,
      factory: async () => {
        const guides = await this.guideRepository.findAll()
        return guides.map((guide) => new GuideDto(guide))
      },
    })
  }

  async getGuidesWithFilters(filters: GuideFilters): Promise<GuideListResponse> {
    // (on ne met pas en cache ici car les filtres/pagination produisent de nombreuses combinaisons)
    const { guides, total } = await this.guideRepository.findWithFilters(filters)

    const guideDtos = guides.map((guide) => new GuideDto(guide))

    if (filters.page !== undefined || filters.limit !== undefined) {
      const page = filters.page || 1
      const limit = filters.limit || 20
      const totalPages = Math.ceil(total / limit)
      const skip = (page - 1) * limit

      return {
        guides: guideDtos,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: skip + guides.length < total,
          hasPrevPage: page > 1,
        },
      }
    }

    return { guides: guideDtos }
  }

  async getGuideById(id: number): Promise<GuideDto> {
    const guide = await this.guideRepository.findById(id)
    if (!guide) {
      throw new NotFoundException('Guide non trouvé')
    }
    return new GuideDto(guide)
  }

  async getGuideBySlug(slug: string): Promise<GuideDto> {
    const guide = await this.guideRepository.findBySlug(slug)
    if (!guide) {
      throw new NotFoundException('Guide non trouvé')
    }
    return new GuideDto(guide)
  }

  async getGuideBySlugAndIncrementViews(slug: string): Promise<GuideDto> {
    // pas de cache ici : la vue est incrémentée
    const guide = await this.guideRepository.findBySlug(slug)
    if (!guide) {
      throw new NotFoundException('Guide non trouvé')
    }

    const updatedGuide = await this.guideRepository.incrementViewCount(guide.id)
    if (!updatedGuide) {
      throw new Error('Erreur lors de la mise à jour du compteur de vues')
    }

    return new GuideDto(updatedGuide)
  }

  async getPopularGuides(): Promise<GuideDto[]> {
    return cache.getOrSet({
      key: CacheService.KEYS.GUIDES_POPULAR,
      ttl: CacheService.TTL.MEDIUM,
      factory: async () => {
        const guides = await this.guideRepository.findPopular()
        return guides.map((guide) => new GuideDto(guide))
      },
    })
  }

  async getGuidesByGame(gameId: number): Promise<GuideDto[]> {
    return cache.getOrSet({
      key: CacheService.KEYS.GUIDES_BY_GAME(gameId),
      ttl: CacheService.TTL.MEDIUM,
      factory: async () => {
        const guides = await this.guideRepository.findByGame(gameId)
        return guides.map((guide) => new GuideDto(guide))
      },
    })
  }

  async createGuide(data: GuideCreateData, imageFile?: MultipartFile): Promise<GuideDto> {
    if (!data.sections || data.sections.length === 0) {
      throw new BadRequestException('Le guide doit contenir au moins une section')
    }

    let imageId: number | undefined

    if (imageFile) {
      const uploadedImage = await this.imageService.uploadImage(imageFile)
      imageId = uploadedImage.id
    }

    const guideData = {
      ...data,
      imageId,
    }

    const guide = await this.guideRepository.create(guideData)

    // recharger la version complète (relations) pour la réponse
    const completeGuide = await this.guideRepository.findById(guide.id)
    if (!completeGuide) {
      throw new Error('Failed to fetch created guide')
    }

    if (completeGuide.imageId) {
      await completeGuide.load('image')
    }

    // Invalidation des caches liés
    await CacheService.invalidateGuideCaches(completeGuide.gameId)

    return new GuideDto(completeGuide)
  }

  async updateGuide(
    id: number,
    data: GuideUpdateData,
    imageFile?: MultipartFile
  ): Promise<GuideDto> {
    if (data.sections !== undefined && data.sections.length === 0) {
      throw new BadRequestException('Le guide doit contenir au moins une section')
    }

    let updateData = { ...data }

    if (imageFile) {
      const uploadedImage = await this.imageService.uploadImage(imageFile)
      updateData.imageId = uploadedImage.id
    }

    const guide = await this.guideRepository.update(id, updateData)
    if (!guide) {
      throw new NotFoundException('Guide non trouvé')
    }

    const completeGuide = await this.guideRepository.findById(guide.id)
    if (!completeGuide) {
      throw new Error('Failed to fetch updated guide')
    }

    if (completeGuide.imageId) {
      await completeGuide.load('image')
    }

    // Invalidation des caches liés
    await CacheService.invalidateGuideCaches(completeGuide.gameId)

    return new GuideDto(completeGuide)
  }

  async deleteGuide(id: number): Promise<void> {
    const guide = await this.guideRepository.findById(id)
    if (!guide) {
      throw new NotFoundException('Guide non trouvé')
    }

    const result = await this.guideRepository.delete(id)
    if (!result) {
      throw new Error('Échec de la suppression du guide')
    }

    // Invalidation des caches liés
    await CacheService.invalidateGuideCaches(guide.gameId)
  }
}
