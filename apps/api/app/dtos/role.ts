import { BaseModelDto } from '@adocasts.com/dto/base'
import Role from '#models/role'

export default class RoleDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare slug: string
  declare description: string | null
  declare createdAt: string
  declare updatedAt: string | null

  constructor(role?: Role) {
    super()

    if (!role) return
    this.id = role.id
    this.name = role.name
    this.slug = role.slug
    this.description = role.description
    this.createdAt = role.createdAt.toISO()!
    this.updatedAt = role.updatedAt?.toISO()!
  }
}
