import { inject } from '@adonisjs/core'
import GameRepository, {
  GameCreateData,
  GameFilters,
  GameUpdateData,
} from '#repositories/game_repository'
import { ConflictException } from '#exceptions/http_exceptions'
import GameDto from '#dtos/game'
import type { SimplePaginatorMetaKeys } from '@adonisjs/lucid/types/querybuilder'

@inject()
export default class GameService {
  constructor(private gameRepository: GameRepository) {}

  async getGames(
    filters: GameFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<{ data: GameDto[]; meta: SimplePaginatorMetaKeys }> {
    if (page < 1) page = 1
    if (perPage < 1 || perPage > 100) perPage = 20

    const sanitizedFilters: GameFilters = {
      search: filters.search?.trim() || undefined,
      isPopular: filters.isPopular,
      genreIds: filters.genreIds?.filter((id) => id > 0) || undefined,
      platformIds: filters.platformIds?.filter((id) => id > 0) || undefined,
    }

    const games = await this.gameRepository.findMany(sanitizedFilters, page, perPage)

    return {
      data: GameDto.fromArray(games.all()),
      meta: games.getMeta(),
    }
  }

  async getGameById(id: number): Promise<GameDto | null> {
    const game = await this.gameRepository.findById(id)
    return game ? new GameDto(game) : null
  }

  async getGameBySlug(slug: string): Promise<GameDto | null> {
    const game = await this.gameRepository.findBySlug(slug)
    return game ? new GameDto(game) : null
  }

  async getPopularGames(limit: number = 10): Promise<GameDto[]> {
    if (limit < 1 || limit > 50) limit = 10
    const games = await this.gameRepository.findPopular(limit)
    return GameDto.fromArray(games)
  }

  async createGame(data: GameCreateData): Promise<GameDto> {
    const game = await this.gameRepository.create(data)
    return new GameDto(game)
  }

  async updateGame(id: number, data: GameUpdateData): Promise<GameDto> {
    const updatedGame = await this.gameRepository.update(id, data)!
    return new GameDto(updatedGame)
  }

  async deleteGame(id: number): Promise<void> {
    const hasContent = await this.gameRepository.hasContent(id)
    if (hasContent) {
      throw new ConflictException(
        'Impossible de supprimer un jeu qui contient des articles ou des guides'
      )
    }

    await this.gameRepository.delete(id)
  }

  async getGameStats(): Promise<{
    total: number
    popular: number
    withArticles: number
    withGuides: number
  }> {
    return this.gameRepository.getStats()
  }
}
