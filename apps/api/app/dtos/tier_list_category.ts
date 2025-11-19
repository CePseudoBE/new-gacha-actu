import { BaseModelDto } from '@adocasts.com/dto/base'
import TierListCategory from '#models/tier_list_category'

export default class TierListCategoryDto extends BaseModelDto {
  declare id: number
  declare tierListId: number
  declare name: string
  declare slug: string
  declare description: string | null
  declare icon: string | null
  declare order: number
  declare createdAt: string
  declare updatedAt: string

  constructor(category?: TierListCategory) {
    super()

    if (!category) return
    this.id = category.id
    this.tierListId = category.tierListId
    this.name = category.name
    this.slug = category.slug
    this.description = category.description
    this.icon = category.icon
    this.order = category.order
    this.createdAt = category.createdAt.toISO()!
    this.updatedAt = category.updatedAt.toISO()!
  }
}
