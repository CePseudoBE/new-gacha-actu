import { BaseModelDto } from '@adocasts.com/dto/base'
import TierListEntry from '#models/tier_list_entry'
import TierDto from '#dtos/tier'
import CharacterDto from '#dtos/character'
import TierListCategoryDto from '#dtos/tier_list_category'

export default class TierListEntryDto extends BaseModelDto {
  declare id: number
  declare tierListId: number
  declare categoryId: number | null
  declare characterId: number
  declare tierId: number
  declare notes: string | null
  declare order: number
  declare createdAt: string
  declare updatedAt: string
  declare tier: TierDto | null
  declare character: CharacterDto | null
  declare category: TierListCategoryDto | null

  constructor(entry?: TierListEntry) {
    super()

    if (!entry) return
    this.id = entry.id
    this.tierListId = entry.tierListId
    this.categoryId = entry.categoryId
    this.characterId = entry.characterId
    this.tierId = entry.tierId
    this.notes = entry.notes
    this.order = entry.order
    this.createdAt = entry.createdAt.toISO()!
    this.updatedAt = entry.updatedAt.toISO()!
    this.tier = entry.tier !== undefined ? new TierDto(entry.tier) : null
    this.character = entry.character !== undefined ? new CharacterDto(entry.character) : null
    this.category = entry.category !== undefined ? new TierListCategoryDto(entry.category) : null
  }
}
