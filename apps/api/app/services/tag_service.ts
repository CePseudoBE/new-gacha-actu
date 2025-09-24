import { inject } from '@adonisjs/core'
import TagRepository, {
  TagCreateData,
  TagFilters,
  TagUpdateData,
} from '#repositories/tag_repository'
import TagDto from '#dtos/tag'
import type { SimplePaginatorMetaKeys } from '@adonisjs/lucid/types/querybuilder'

@inject()
export default class TagService {
  constructor(private tagRepository: TagRepository) {}

  async getTags(
    filters: TagFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<{ data: TagDto[]; meta: SimplePaginatorMetaKeys }> {
    if (page < 1) page = 1
    if (perPage < 1 || perPage > 100) perPage = 20

    const sanitizedFilters: TagFilters = {
      search: filters.search?.trim() || undefined,
    }

    const tags = await this.tagRepository.findMany(sanitizedFilters, page, perPage)

    return {
      data: TagDto.fromArray(tags.all()),
      meta: tags.getMeta(),
    }
  }

  async getAllTags(): Promise<TagDto[]> {
    const tags = await this.tagRepository.findAll()
    return TagDto.fromArray(tags)
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
    return new TagDto(tag)
  }

  async updateTag(id: number, data: TagUpdateData): Promise<TagDto> {
    const updatedTag = await this.tagRepository.update(id, data)
    return new TagDto(updatedTag)
  }

  async deleteTag(id: number): Promise<void> {
    await this.tagRepository.delete(id)
  }
}