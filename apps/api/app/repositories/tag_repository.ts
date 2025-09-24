import Tag from '#models/tag'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export interface TagFilters {
  search?: string
}

export interface TagCreateData {
  name: string
}

export interface TagUpdateData extends Partial<TagCreateData> {}

export default class TagRepository {
  async findMany(
    filters: TagFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<ModelPaginatorContract<Tag>> {
    const query = Tag.query().orderBy('name', 'asc')

    if (filters.search) {
      query.where('name', 'ilike', `%${filters.search}%`)
    }

    return query.paginate(page, perPage)
  }

  async findAll(): Promise<Tag[]> {
    return Tag.query().orderBy('name', 'asc')
  }

  async findById(id: number): Promise<Tag | null> {
    return Tag.find(id)
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    return Tag.query().where('slug', slug).first()
  }

  async create(data: TagCreateData): Promise<Tag> {
    return Tag.create(data)
  }

  async update(id: number, data: TagUpdateData): Promise<Tag> {
    const tag = await Tag.findOrFail(id)
    tag.merge(data)
    await tag.save()
    return tag
  }

  async delete(id: number): Promise<void> {
    const tag = await Tag.findOrFail(id)
    await tag.delete()
  }
}