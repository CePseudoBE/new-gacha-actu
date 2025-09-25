import { inject } from '@adonisjs/core'
import GenreRepository, { GenreCreateData, GenreUpdateData } from '#repositories/genre_repository'
import GenreDto from '#dtos/genre'
import CacheService from '#services/cache_service'
import cache from '@adonisjs/cache/services/main'

@inject()
export default class GenreService {
  constructor(private genreRepository: GenreRepository) {}

  async getAllGenres(): Promise<GenreDto[]> {
    return await cache.getOrSet({
      key: CacheService.KEYS.GENRES_ALL,
      factory: async () => {
        const genres = await this.genreRepository.findAll()
        return GenreDto.fromArray(genres)
      },
      ttl: CacheService.TTL.LONG,
    })
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

    await cache.delete({ key: CacheService.KEYS.GENRES_ALL })

    return new GenreDto(genre)
  }

  async updateGenre(id: number, data: GenreUpdateData): Promise<GenreDto> {
    const updatedGenre = await this.genreRepository.update(id, data)

    await cache.delete({ key: CacheService.KEYS.GENRES_ALL })

    return new GenreDto(updatedGenre)
  }

  async deleteGenre(id: number): Promise<void> {
    await this.genreRepository.delete(id)

    await cache.delete({ key: CacheService.KEYS.GENRES_ALL })
  }
}
