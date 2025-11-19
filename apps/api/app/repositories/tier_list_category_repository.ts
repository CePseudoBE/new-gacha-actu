import TierListCategory from '#models/tier_list_category'

export interface TierListCategoryCreateData {
  tierListId: number
  name: string
  description?: string | null
  icon?: string | null
  order?: number
}

export interface TierListCategoryUpdateData extends Partial<Omit<TierListCategoryCreateData, 'tierListId'>> {}

export default class TierListCategoryRepository {
  async findById(id: number): Promise<TierListCategory | null> {
    return TierListCategory.find(id)
  }

  async findByTierListId(tierListId: number): Promise<TierListCategory[]> {
    return TierListCategory.query().where('tierListId', tierListId).orderBy('order', 'asc')
  }

  async create(data: TierListCategoryCreateData): Promise<TierListCategory> {
    return await TierListCategory.create({
      tierListId: data.tierListId,
      name: data.name,
      description: data.description,
      icon: data.icon,
      order: data.order || 0,
    })
  }

  async update(id: number, data: TierListCategoryUpdateData): Promise<TierListCategory | null> {
    const category = await TierListCategory.find(id)
    if (!category) return null

    const updateData = Object.fromEntries(
      Object.entries({
        name: data.name,
        description: data.description,
        icon: data.icon,
        order: data.order,
      }).filter(([, value]) => value !== undefined)
    )

    category.merge(updateData)
    await category.save()

    return category
  }

  async delete(id: number): Promise<boolean> {
    const category = await TierListCategory.find(id)
    if (!category) return false

    await category.delete()
    return true
  }
}
