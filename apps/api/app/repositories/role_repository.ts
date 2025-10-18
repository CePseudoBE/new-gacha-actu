import Role from '#models/role'

export interface RoleCreateData {
  name: string
  description?: string
}

export interface RoleUpdateData extends Partial<RoleCreateData> {}

export default class RoleRepository {
  async findAll(): Promise<Role[]> {
    return Role.query().orderBy('name', 'asc')
  }

  async findById(id: number): Promise<Role | null> {
    return Role.find(id)
  }

  async findBySlug(slug: string): Promise<Role | null> {
    return Role.findBy('slug', slug)
  }

  async findByName(name: string): Promise<Role | null> {
    return Role.findBy('name', name)
  }

  async create(data: RoleCreateData): Promise<Role> {
    return Role.create({
      name: data.name,
      description: data.description,
    })
  }

  async update(id: number, data: RoleUpdateData): Promise<Role | null> {
    const role = await Role.find(id)
    if (!role) return null

    const updateData = Object.fromEntries(
      Object.entries({
        name: data.name,
        description: data.description,
      }).filter(([, value]) => value !== undefined)
    )

    role.merge(updateData)
    await role.save()

    return role
  }

  async delete(id: number): Promise<boolean> {
    const role = await Role.find(id)
    if (!role) return false

    await role.delete()
    return true
  }

  async count(): Promise<number> {
    const result = await Role.query().count('* as total')
    return Number(result[0].$extras.total)
  }
}
