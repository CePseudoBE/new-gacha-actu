import { BaseModelDto } from '@adocasts.com/dto/base'
import User from '#models/user'
import RoleDto from '#dtos/role'

export default class UserDto extends BaseModelDto {
  declare id: number
  declare fullName: string | null
  declare email: string
  declare roleId: number
  declare role?: RoleDto
  declare createdAt: string
  declare updatedAt: string | null

  constructor(user?: User) {
    super()

    if (!user) return
    this.id = user.id
    this.fullName = user.fullName
    this.email = user.email
    this.roleId = user.roleId
    this.createdAt = user.createdAt.toISO()!
    this.updatedAt = user.updatedAt?.toISO()!

    if (user.role) {
      this.role = new RoleDto(user.role)
    }
  }
}
