import Platform from '#models/platform'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export interface PlatformFilters {
  search?: string
}

export interface PlatformCreateData {
  name: string
}

export interface PlatformUpdateData extends Partial<PlatformCreateData> {}

export default class PlatformRepository {
  async findMany(
    filters: PlatformFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<ModelPaginatorContract<Platform>> {
    const query = Platform.query().orderBy('name', 'asc')

    if (filters.search) {
      query.where('name', 'ilike', `%${filters.search}%`)
    }

    return query.paginate(page, perPage)
  }

  async findAll(): Promise<Platform[]> {
    return Platform.query().orderBy('name', 'asc')
  }

  async findById(id: number): Promise<Platform | null> {
    return Platform.find(id)
  }

  async findBySlug(slug: string): Promise<Platform | null> {
    return Platform.query().where('slug', slug).first()
  }

  async create(data: PlatformCreateData): Promise<Platform> {
    return Platform.create(data)
  }

  async update(id: number, data: PlatformUpdateData): Promise<Platform> {
    const platform = await Platform.findOrFail(id)
    platform.merge(data)
    await platform.save()
    return platform
  }

  async delete(id: number): Promise<void> {
    const platform = await Platform.findOrFail(id)
    await platform.delete()
  }
}