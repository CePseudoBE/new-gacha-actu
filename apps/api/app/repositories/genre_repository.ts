import Genre from '#models/genre'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export interface GenreFilters {
  search?: string
}

export interface GenreCreateData {
  name: string
  description: string
}

export interface GenreUpdateData extends Partial<GenreCreateData> {}

export default class GenreRepository {
  async findMany(
    filters: GenreFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<ModelPaginatorContract<Genre>> {
    const query = Genre.query().orderBy('name', 'asc')

    if (filters.search) {
      query.where('name', 'ilike', `%${filters.search}%`)
    }

    return query.paginate(page, perPage)
  }

  async findAll(): Promise<Genre[]> {
    return Genre.query().orderBy('name', 'asc')
  }

  async findById(id: number): Promise<Genre | null> {
    return Genre.find(id)
  }

  async findBySlug(slug: string): Promise<Genre | null> {
    return Genre.query().where('slug', slug).first()
  }

  async create(data: GenreCreateData): Promise<Genre> {
    return Genre.create(data)
  }

  async update(id: number, data: GenreUpdateData): Promise<Genre> {
    const genre = await Genre.findOrFail(id)
    genre.merge(data)
    await genre.save()
    return genre
  }

  async delete(id: number): Promise<void> {
    const genre = await Genre.findOrFail(id)
    await genre.delete()
  }

}