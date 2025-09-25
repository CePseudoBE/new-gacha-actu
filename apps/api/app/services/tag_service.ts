import { inject } from '@adonisjs/core'
import TagRepository, { TagCreateData, TagUpdateData } from '#repositories/tag_repository'
import TagDto from '#dtos/tag'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'

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

  async getTagById(id: number): Promise<TagDto | null> {
    const tag = await this.tagRepository.findById(id)
    return tag ? new TagDto(tag) : null
  }

  async getTagBySlug(slug: string): Promise<TagDto | null> {
    const tag = await this.tagRepository.findBySlug(slug)
    return tag ? new TagDto(tag) : null
  }

  async createTag(data: TagCreateData): Promise<TagDto> {
    const tag = await this.tagRepository.create(data)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.TAGS_ALL })

    return new TagDto(tag)
  }

  async updateTag(id: number, data: TagUpdateData): Promise<TagDto> {
    const updatedTag = await this.tagRepository.update(id, data)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.TAGS_ALL })

    return new TagDto(updatedTag)
  }

  async deleteTag(id: number): Promise<void> {
    await this.tagRepository.delete(id)

    // Invalidation des caches liés
    await cache.delete({ key: CacheService.KEYS.TAGS_ALL })
  }
}
