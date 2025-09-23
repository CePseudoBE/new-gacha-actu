import { inject } from '@adonisjs/core'
import GameRepository, {
  GameCreateData,
  GameFilters,
  GameUpdateData,
} from '#repositories/game_repository'
import Game from '#models/game'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { NotFoundException, ConflictException } from '#exceptions/http_exceptions'

@inject()
export default class GameService {
  constructor(private gameRepository: GameRepository) {}

  /**
   * Récupère la liste des jeux avec pagination et filtres
   */
  async getGames(
    filters: GameFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<ModelPaginatorContract<Game>> {
    // Validation des paramètres de pagination
    if (page < 1) page = 1
    if (perPage < 1 || perPage > 100) perPage = 20

    // Nettoyage des filtres
    const sanitizedFilters: GameFilters = {
      search: filters.search?.trim() || undefined,
      isPopular: filters.isPopular,
      genreIds: filters.genreIds?.filter((id) => id > 0) || undefined,
      platformIds: filters.platformIds?.filter((id) => id > 0) || undefined,
    }

    return this.gameRepository.findMany(sanitizedFilters, page, perPage)
  }

  /**
   * Récupère un jeu par son ID
   */
  async getGameById(id: number): Promise<Game | null> {
    return this.gameRepository.findById(id)
  }

  /**
   * Récupère un jeu par son slug
   */
  async getGameBySlug(slug: string): Promise<Game | null> {
    return this.gameRepository.findBySlug(slug)
  }

  /**
   * Récupère les jeux populaires
   */
  async getPopularGames(limit: number = 10): Promise<Game[]> {
    if (limit < 1 || limit > 50) limit = 10
    return this.gameRepository.findPopular(limit)
  }

  /**
   * Crée un nouveau jeu
   */
  async createGame(data: GameCreateData): Promise<Game> {
    return this.gameRepository.create(data)
  }

  /**
   * Met à jour un jeu
   */
  async updateGame(id: number, data: GameUpdateData): Promise<Game> {
    // Vérifier que le jeu existe
    const existingGame = await this.gameRepository.findById(id)
    if (!existingGame) {
      throw new NotFoundException('Jeu non trouvé')
    }

    const updatedGame = await this.gameRepository.update(id, data)
    if (!updatedGame) {
      throw new ConflictException('Erreur lors de la mise à jour du jeu')
    }

    return updatedGame
  }

  /**
   * Supprime un jeu
   */
  async deleteGame(id: number): Promise<void> {
    // Vérifier que le jeu existe
    const existingGame = await this.gameRepository.findById(id)
    if (!existingGame) {
      throw new NotFoundException('Jeu non trouvé')
    }

    // Règle métier : ne pas supprimer un jeu avec du contenu
    if (existingGame.articles && existingGame.articles.length > 0) {
      throw new ConflictException('Impossible de supprimer un jeu qui contient des articles')
    }

    if (existingGame.guides && existingGame.guides.length > 0) {
      throw new ConflictException('Impossible de supprimer un jeu qui contient des guides')
    }

    const deleted = await this.gameRepository.delete(id)
    if (!deleted) {
      throw new ConflictException('Erreur lors de la suppression du jeu')
    }
  }

  /**
   * Récupère les statistiques des jeux
   */
  async getGameStats(): Promise<{
    total: number
    popular: number
    withArticles: number
    withGuides: number
  }> {
    return this.gameRepository.getStats()
  }
}
