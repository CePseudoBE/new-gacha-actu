import User from '#models/user'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export interface UserFilters {
  search?: string
  roleId?: number
}

export interface UserCreateData {
  fullName: string
  email: string
  password: string
  roleId: number
}

export interface UserUpdateData {
  fullName?: string
  email?: string
  password?: string
  roleId?: number
}

export default class UserRepository {
  async findMany(
    filters: UserFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<ModelPaginatorContract<User>> {
    const query = User.query().preload('role')

    if (filters.search) {
      query.where((builder) => {
        builder
          .where('fullName', 'ILIKE', `%${filters.search}%`)
          .orWhere('email', 'ILIKE', `%${filters.search}%`)
      })
    }

    if (filters.roleId) {
      query.where('roleId', filters.roleId)
    }

    query.orderBy('createdAt', 'desc')

    return query.paginate(page, perPage)
  }

  async findById(id: number): Promise<User | null> {
    return User.query().where('id', id).preload('role').first()
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.query().where('email', email).preload('role').first()
  }

  async create(data: UserCreateData): Promise<User> {
    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      roleId: data.roleId,
    })

    await user.load('role')
    return user
  }

  async update(id: number, data: UserUpdateData): Promise<User | null> {
    const user = await User.find(id)
    if (!user) return null

    const updateData = Object.fromEntries(
      Object.entries({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        roleId: data.roleId,
      }).filter(([, value]) => value !== undefined)
    )

    user.merge(updateData)
    await user.save()

    await user.load('role')
    return user
  }

  async delete(id: number): Promise<boolean> {
    const user = await User.find(id)
    if (!user) return false

    await user.delete()
    return true
  }

  async count(): Promise<number> {
    const result = await User.query().count('* as total')
    return Number(result[0].$extras.total)
  }

  async countByRole(roleId: number): Promise<number> {
    const result = await User.query().where('roleId', roleId).count('* as total')
    return Number(result[0].$extras.total)
  }

  async emailExists(email: string, excludeId?: number): Promise<boolean> {
    const query = User.query().where('email', email)

    if (excludeId) {
      query.where('id', '!=', excludeId)
    }

    const user = await query.first()
    return !!user
  }
}
