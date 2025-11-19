import { inject } from '@adonisjs/core'
import CharacterRepository, {
  CharacterCreateData,
  CharacterFilters,
  CharacterUpdateData,
} from '#repositories/character_repository'
import { NotFoundException } from '#exceptions/http_exceptions'
import CharacterDto from '#dtos/character'
import type { SimplePaginatorMetaKeys } from '@adonisjs/lucid/types/querybuilder'
import ImageService from '#services/image_service'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import cache from '@adonisjs/cache/services/main'
import CacheService from '#services/cache_service'

@inject()
export default class CharacterService {
  constructor(
    private characterRepository: CharacterRepository,
    private imageService: ImageService
  ) {}

  async getCharacters(
    filters: CharacterFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<{ data: CharacterDto[]; meta: SimplePaginatorMetaKeys }> {
    if (page < 1) page = 1
    if (perPage < 1 || perPage > 100) perPage = 20

    const sanitizedFilters: CharacterFilters = {
      gameId: filters.gameId,
      rarity: filters.rarity?.trim() || undefined,
      element: filters.element?.trim() || undefined,
      role: filters.role?.trim() || undefined,
      isLimited: filters.isLimited,
      search: filters.search?.trim() || undefined,
    }

    const characters = await this.characterRepository.findMany(sanitizedFilters, page, perPage)

    return {
      data: CharacterDto.fromArray(characters.all()),
      meta: characters.getMeta(),
    }
  }

  async getCharacterById(id: number): Promise<CharacterDto> {
    const character = await this.characterRepository.findById(id)
    if (!character) {
      throw new NotFoundException('Personnage non trouvé')
    }
    return new CharacterDto(character)
  }

  async getCharacterBySlug(slug: string): Promise<CharacterDto> {
    const character = await this.characterRepository.findBySlug(slug)
    if (!character) {
      throw new NotFoundException('Personnage non trouvé')
    }
    return new CharacterDto(character)
  }

  async getCharactersByGameId(gameId: number, limit: number = 100): Promise<CharacterDto[]> {
    if (limit < 1 || limit > 200) limit = 100

    return await cache.getOrSet({
      key: CacheService.KEYS.CHARACTERS_BY_GAME(gameId, limit),
      ttl: CacheService.TTL.MEDIUM,
      factory: async () => {
        const characters = await this.characterRepository.findByGameId(gameId, limit)
        return CharacterDto.fromArray(characters)
      },
    })
  }

  async createCharacter(data: CharacterCreateData, imageFile?: MultipartFile): Promise<CharacterDto> {
    let imageId: number | undefined

    if (imageFile) {
      const uploadedImage = await this.imageService.uploadImage(imageFile)
      imageId = uploadedImage.id
    }

    const characterData = {
      ...data,
      imageId,
    }

    const character = await this.characterRepository.create(characterData)
    if (character.imageId) {
      await character.load('image')
    }

    await CacheService.invalidateCharacterCaches(character.gameId)

    return new CharacterDto(character)
  }

  async updateCharacter(id: number, data: CharacterUpdateData, imageFile?: MultipartFile): Promise<CharacterDto> {
    let updateData = { ...data }

    if (imageFile) {
      const uploadedImage = await this.imageService.uploadImage(imageFile)
      updateData.imageId = uploadedImage.id
    }

    const updatedCharacter = await this.characterRepository.update(id, updateData)
    if (!updatedCharacter) {
      throw new NotFoundException('Personnage non trouvé')
    }

    if (updatedCharacter.imageId) {
      await updatedCharacter.load('image')
    }

    await CacheService.invalidateCharacterCaches(updatedCharacter.gameId)

    return new CharacterDto(updatedCharacter)
  }

  async deleteCharacter(id: number): Promise<void> {
    const character = await this.characterRepository.findById(id)
    if (!character) {
      throw new NotFoundException('Personnage non trouvé')
    }

    await this.characterRepository.delete(id)

    await CacheService.invalidateCharacterCaches(character.gameId)
  }
}
