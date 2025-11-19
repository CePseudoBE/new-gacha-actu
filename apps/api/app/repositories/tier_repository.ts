import Tier from '#models/tier'

export interface TierUpdateData {
  label?: string
  color?: string
  description?: string | null
}

export default class TierRepository {
  async findAll(): Promise<Tier[]> {
    return Tier.query().orderBy('order', 'asc')
  }

  async findById(id: number): Promise<Tier | null> {
    return Tier.find(id)
  }

  async update(id: number, data: TierUpdateData): Promise<Tier | null> {
    const tier = await Tier.find(id)
    if (!tier) return null

    const updateData = Object.fromEntries(
      Object.entries({
        label: data.label,
        color: data.color,
        description: data.description,
      }).filter(([, value]) => value !== undefined)
    )

    tier.merge(updateData)
    await tier.save()

    return tier
  }
}
