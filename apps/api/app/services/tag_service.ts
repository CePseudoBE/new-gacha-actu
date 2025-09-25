import { inject } from '@adonisjs/core'
import TagRepository, { TagCreateData, TagUpdateData } from '#repositories/tag_repository'
import TagDto from '#dtos/tag'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'
import { NotFoundException } from '#exceptions/http_exceptions'

@inject()
export default class TagService {
  constructor(private tagRepository: TagRepository) {}

  async getAllTags(): Promise<TagDto[]> {
    return cache.getOrSet({
      key: CacheService.KEYS.TAGS_ALL,
      ttl: CacheService.TTL.LONG,
      factory: async () => {
        const tags = await this.tagRepository.findAll()
        return TagDto.fromArray(tags)
      },
    })
  }

  async getTagById(id: number): Promise<TagDto> {
    const tag = await this.tagRepository.findById(id)
    if (!tag) {
      throw new NotFoundException('Tag non trouvé')
    }
    return new TagDto(tag)
  }

  async getTagBySlug(slug: string): Promise<TagDto> {
    const tag = await this.tagRepository.findBySlug(slug)
    if (!tag) {
      throw new NotFoundException('Tag non trouvé')
    }
    return new TagDto(tag)
  }

  async createTag(data: TagCreateData): Promise<TagDto> {
    const tag = await this.tagRepository.create(data)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.TAGS_ALL })

    return new TagDto(tag)
  }

  async updateTag(id: number, data: TagUpdateData): Promise<TagDto> {
    const updatedTag = await this.tagRepository.update(id, data)
    if (!updatedTag) {
      throw new NotFoundException('Tag non trouvé')
    }

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.TAGS_ALL })

    return new TagDto(updatedTag)
  }

  async deleteTag(id: number): Promise<void> {
    const tag = await this.tagRepository.findById(id)
    if (!tag) {
      throw new NotFoundException('Tag non trouvé')
    }

    await this.tagRepository.delete(id)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.TAGS_ALL })
  }
}
