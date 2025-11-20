import { inject } from '@adonisjs/core'
import TierListRepository from '#repositories/tier_list_repository'
import type {
  TierListCreateData,
  TierListFilters,
  TierListUpdateData,
} from '#repositories/tier_list_repository'
import TierListCategoryRepository from '#repositories/tier_list_category_repository'
import type { TierListCategoryCreateData } from '#repositories/tier_list_category_repository'
import TierListEntryRepository from '#repositories/tier_list_entry_repository'
import type {
  TierListEntryCreateData,
  BulkTierListEntryUpdate,
} from '#repositories/tier_list_entry_repository'
import { NotFoundException } from '#exceptions/http_exceptions'
import TierListDto from '#dtos/tier_list'
import type { SimplePaginatorMetaKeys } from '@adonisjs/lucid/types/querybuilder'
import ImageService from '#services/image_service'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import cache from '@adonisjs/cache/services/main'
import CacheService from '#services/cache_service'

type TierListCategoryInput = Omit<TierListCategoryCreateData, 'tierListId'>
type TierListEntryInput = Omit<TierListEntryCreateData, 'tierListId'>

@inject()
export default class TierListService {
  constructor(
    private tierListRepository: TierListRepository,
    private tierListCategoryRepository: TierListCategoryRepository,
    private tierListEntryRepository: TierListEntryRepository,
    private imageService: ImageService
  ) {}

  async getTierLists(
    filters: TierListFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<{ data: TierListDto[]; meta: SimplePaginatorMetaKeys }> {
    if (page < 1) page = 1
    if (perPage < 1 || perPage > 100) perPage = 20

    const sanitizedFilters: TierListFilters = {
      gameId: filters.gameId,
      isPublished: filters.isPublished,
      search: filters.search?.trim() || undefined,
    }

    const tierLists = await this.tierListRepository.findMany(sanitizedFilters, page, perPage)

    return {
      data: TierListDto.fromArray(tierLists.all()),
      meta: tierLists.getMeta(),
    }
  }

  async getTierListById(id: number): Promise<TierListDto> {
    const tierList = await this.tierListRepository.findById(id)
    if (!tierList) {
      throw new NotFoundException('Tier list non trouvée')
    }
    return new TierListDto(tierList)
  }

  async getTierListBySlug(slug: string): Promise<TierListDto> {
    return await cache.getOrSet({
      key: CacheService.KEYS.TIER_LISTS_BY_SLUG(slug),
      ttl: CacheService.TTL.LONG,
      factory: async () => {
        const tierList = await this.tierListRepository.findBySlug(slug)
        if (!tierList) {
          throw new NotFoundException('Tier list non trouvée')
        }
        return new TierListDto(tierList)
      },
    })
  }

  async getTierListBySlugAndIncrementViews(slug: string): Promise<TierListDto> {
    const tierList = await this.tierListRepository.findBySlug(slug)
    if (!tierList) {
      throw new NotFoundException('Tier list non trouvée')
    }

    await this.tierListRepository.incrementViews(tierList.id)

    return new TierListDto(tierList)
  }

  async getTierListsByGameId(gameId: number, limit: number = 10): Promise<TierListDto[]> {
    if (limit < 1 || limit > 50) limit = 10

    return await cache.getOrSet({
      key: CacheService.KEYS.TIER_LISTS_BY_GAME(gameId, limit),
      ttl: CacheService.TTL.MEDIUM,
      factory: async () => {
        const tierLists = await this.tierListRepository.findByGameId(gameId, limit)
        return TierListDto.fromArray(tierLists)
      },
    })
  }

  async getPopularTierLists(limit: number = 10): Promise<TierListDto[]> {
    if (limit < 1 || limit > 50) limit = 10

    return await cache.getOrSet({
      key: CacheService.KEYS.TIER_LISTS_POPULAR(limit),
      ttl: CacheService.TTL.MEDIUM,
      factory: async () => {
        const tierLists = await this.tierListRepository.findPopular(limit)
        return TierListDto.fromArray(tierLists)
      },
    })
  }

  async createTierList(
    data: TierListCreateData & { categories?: TierListCategoryInput[]; entries?: TierListEntryInput[] },
    imageFile?: MultipartFile
  ): Promise<TierListDto> {
    let imageId: number | undefined

    if (imageFile) {
      const uploadedImage = await this.imageService.uploadImage(imageFile)
      imageId = uploadedImage.id
    }

    const tierListData = {
      ...data,
      imageId,
    }

    const tierList = await this.tierListRepository.create(tierListData)

    if (data.categories && data.categories.length > 0) {
      for (const categoryData of data.categories) {
        await this.tierListCategoryRepository.create({
          ...categoryData,
          tierListId: tierList.id,
        })
      }
    }

    if (data.entries && data.entries.length > 0) {
      for (const entryData of data.entries) {
        const exists = await this.tierListEntryRepository.exists(
          tierList.id,
          entryData.categoryId || null,
          entryData.characterId
        )

        if (!exists) {
          await this.tierListEntryRepository.create({
            ...entryData,
            tierListId: tierList.id,
          })
        }
      }
    }

    if (tierList.imageId) {
      await tierList.load('image')
    }
    await tierList.load('game')
    await tierList.load('author')
    await tierList.load('categories')
    await tierList.load('entries')

    await this.invalidateTierListCaches(tierList.slug, tierList.gameId)

    return new TierListDto(tierList)
  }

  async updateTierList(
    id: number,
    data: TierListUpdateData & { categories?: TierListCategoryInput[]; entries?: TierListEntryInput[] },
    imageFile?: MultipartFile
  ): Promise<TierListDto> {
    let updateData = { ...data }

    if (imageFile) {
      const uploadedImage = await this.imageService.uploadImage(imageFile)
      updateData.imageId = uploadedImage.id
    }

    const updatedTierList = await this.tierListRepository.update(id, updateData)
    if (!updatedTierList) {
      throw new NotFoundException('Tier list non trouvée')
    }

    if (data.categories) {
      const existingCategories = await this.tierListCategoryRepository.findByTierListId(id)
      for (const category of existingCategories) {
        await this.tierListCategoryRepository.delete(category.id)
      }

      for (const categoryData of data.categories) {
        await this.tierListCategoryRepository.create({
          ...categoryData,
          tierListId: id,
        })
      }
    }

    if (data.entries) {
      await this.tierListEntryRepository.deleteByTierListId(id)

      for (const entryData of data.entries) {
        await this.tierListEntryRepository.create({
          ...entryData,
          tierListId: id,
        })
      }
    }

    if (updatedTierList.imageId) {
      await updatedTierList.load('image')
    }
    await updatedTierList.load('game')
    await updatedTierList.load('author')
    await updatedTierList.load('categories')
    await updatedTierList.load('entries')

    await this.invalidateTierListCaches(updatedTierList.slug, updatedTierList.gameId)

    return new TierListDto(updatedTierList)
  }

  async publishTierList(id: number): Promise<TierListDto> {
    const publishedTierList = await this.tierListRepository.publish(id)
    if (!publishedTierList) {
      throw new NotFoundException('Tier list non trouvée')
    }

    await publishedTierList.load('image')
    await publishedTierList.load('game')
    await publishedTierList.load('author')

    await this.invalidateTierListCaches(publishedTierList.slug, publishedTierList.gameId)

    return new TierListDto(publishedTierList)
  }

  async unpublishTierList(id: number): Promise<TierListDto> {
    const unpublishedTierList = await this.tierListRepository.unpublish(id)
    if (!unpublishedTierList) {
      throw new NotFoundException('Tier list non trouvée')
    }

    await unpublishedTierList.load('image')
    await unpublishedTierList.load('game')
    await unpublishedTierList.load('author')

    await this.invalidateTierListCaches(unpublishedTierList.slug, unpublishedTierList.gameId)

    return new TierListDto(unpublishedTierList)
  }

  async deleteTierList(id: number): Promise<void> {
    const tierList = await this.tierListRepository.findById(id)
    if (!tierList) {
      throw new NotFoundException('Tier list non trouvée')
    }

    await this.tierListRepository.delete(id)

    await this.invalidateTierListCaches(tierList.slug, tierList.gameId)
  }

  async bulkUpdateEntries(updates: BulkTierListEntryUpdate[]): Promise<void> {
    await this.tierListEntryRepository.bulkUpdate(updates)
  }

  private async invalidateTierListCaches(slug: string, gameId: number): Promise<void> {
    await CacheService.invalidateTierListCaches(slug, gameId)
  }
}
