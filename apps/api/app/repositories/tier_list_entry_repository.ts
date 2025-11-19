import TierListEntry from '#models/tier_list_entry'

export interface TierListEntryCreateData {
  tierListId: number
  categoryId?: number | null
  characterId: number
  tierId: number
  notes?: string | null
  order?: number
}

export interface TierListEntryUpdateData extends Partial<Omit<TierListEntryCreateData, 'tierListId' | 'characterId'>> {}

export interface BulkTierListEntryUpdate {
  id: number
  tierId?: number
  categoryId?: number | null
  order?: number
}

export default class TierListEntryRepository {
  async findById(id: number): Promise<TierListEntry | null> {
    return TierListEntry.query()
      .where('id', id)
      .preload('character', (characterQuery) => {
        characterQuery.preload('image')
      })
      .preload('tier')
      .preload('category')
      .first()
  }

  async findByTierListId(tierListId: number): Promise<TierListEntry[]> {
    return TierListEntry.query()
      .where('tierListId', tierListId)
      .preload('character', (characterQuery) => {
        characterQuery.preload('image')
      })
      .preload('tier')
      .preload('category')
      .orderBy('order', 'asc')
  }

  async findByTierListAndCategory(tierListId: number, categoryId: number | null): Promise<TierListEntry[]> {
    const query = TierListEntry.query().where('tierListId', tierListId)

    if (categoryId === null) {
      query.whereNull('categoryId')
    } else {
      query.where('categoryId', categoryId)
    }

    return query
      .preload('character', (characterQuery) => {
        characterQuery.preload('image')
      })
      .preload('tier')
      .preload('category')
      .orderBy('order', 'asc')
  }

  async create(data: TierListEntryCreateData): Promise<TierListEntry> {
    return await TierListEntry.create({
      tierListId: data.tierListId,
      categoryId: data.categoryId,
      characterId: data.characterId,
      tierId: data.tierId,
      notes: data.notes,
      order: data.order || 0,
    })
  }

  async update(id: number, data: TierListEntryUpdateData): Promise<TierListEntry | null> {
    const entry = await TierListEntry.find(id)
    if (!entry) return null

    const updateData = Object.fromEntries(
      Object.entries({
        categoryId: data.categoryId,
        tierId: data.tierId,
        notes: data.notes,
        order: data.order,
      }).filter(([, value]) => value !== undefined)
    )

    entry.merge(updateData)
    await entry.save()

    return entry
  }

  async bulkUpdate(updates: BulkTierListEntryUpdate[]): Promise<TierListEntry[]> {
    const updatedEntries: TierListEntry[] = []

    for (const update of updates) {
      const entry = await TierListEntry.find(update.id)
      if (!entry) continue

      const updateData = Object.fromEntries(
        Object.entries({
          tierId: update.tierId,
          categoryId: update.categoryId,
          order: update.order,
        }).filter(([, value]) => value !== undefined)
      )

      entry.merge(updateData)
      await entry.save()

      updatedEntries.push(entry)
    }

    return updatedEntries
  }

  async delete(id: number): Promise<boolean> {
    const entry = await TierListEntry.find(id)
    if (!entry) return false

    await entry.delete()
    return true
  }

  async deleteByTierListId(tierListId: number): Promise<void> {
    await TierListEntry.query().where('tierListId', tierListId).delete()
  }

  async deleteByCategory(categoryId: number): Promise<void> {
    await TierListEntry.query().where('categoryId', categoryId).delete()
  }

  async exists(tierListId: number, categoryId: number | null, characterId: number): Promise<boolean> {
    const query = TierListEntry.query()
      .where('tierListId', tierListId)
      .where('characterId', characterId)

    if (categoryId === null) {
      query.whereNull('categoryId')
    } else {
      query.where('categoryId', categoryId)
    }

    const entry = await query.first()
    return !!entry
  }
}
