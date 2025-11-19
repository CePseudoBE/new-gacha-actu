import { BaseModelDto } from '@adocasts.com/dto/base'
import Tier from '#models/tier'

export default class TierDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare label: string
  declare color: string
  declare order: number
  declare description: string | null
  declare createdAt: string
  declare updatedAt: string

  constructor(tier?: Tier) {
    super()

    if (!tier) return
    this.id = tier.id
    this.name = tier.name
    this.label = tier.label
    this.color = tier.color
    this.order = tier.order
    this.description = tier.description
    this.createdAt = tier.createdAt.toISO()!
    this.updatedAt = tier.updatedAt.toISO()!
  }
}
