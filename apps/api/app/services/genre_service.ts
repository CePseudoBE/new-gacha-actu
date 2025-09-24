import { inject } from '@adonisjs/core'
import GenreRepository, {
  GenreCreateData,
  GenreFilters,
  GenreUpdateData,
} from '#repositories/genre_repository'
import GenreDto from '#dtos/genre'
import type { SimplePaginatorMetaKeys } from '@adonisjs/lucid/types/querybuilder'

@inject()
export default class GenreService {
  constructor(private genreRepository: GenreRepository) {}

  async getGenres(
    filters: GenreFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<{ data: GenreDto[]; meta: SimplePaginatorMetaKeys }> {
    if (page < 1) page = 1
    if (perPage < 1 || perPage > 100) perPage = 20

    const sanitizedFilters: GenreFilters = {
      search: filters.search?.trim() || undefined,
    }

    const genres = await this.genreRepository.findMany(sanitizedFilters, page, perPage)

    return {
      data: GenreDto.fromArray(genres.all()),
      meta: genres.getMeta(),
    }
  }

  async getAllGenres(): Promise<GenreDto[]> {
    const genres = await this.genreRepository.findAll()
    return GenreDto.fromArray(genres)
  }

  async getGenreById(id: number): Promise<GenreDto | null> {
    const genre = await this.genreRepository.findById(id)
    return genre ? new GenreDto(genre) : null
  }

  async getGenreBySlug(slug: string): Promise<GenreDto | null> {
    const genre = await this.genreRepository.findBySlug(slug)
    return genre ? new GenreDto(genre) : null
  }

  async createGenre(data: GenreCreateData): Promise<GenreDto> {
    const genre = await this.genreRepository.create(data)
    return new GenreDto(genre)
  }

  async updateGenre(id: number, data: GenreUpdateData): Promise<GenreDto> {
    const updatedGenre = await this.genreRepository.update(id, data)
    return new GenreDto(updatedGenre)
  }

  async deleteGenre(id: number): Promise<void> {
    await this.genreRepository.delete(id)
  }

}