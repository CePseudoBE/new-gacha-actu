import GuideSection from '#models/guide_section'

export interface GuideSectionCreateData {
  title: string
  content: string
  order: number
  guideId: number
}

export interface GuideSectionUpdateData extends Partial<GuideSectionCreateData> {}

export default class GuideSectionRepository {
  async findAll(): Promise<GuideSection[]> {
    return GuideSection.query().orderBy('order', 'asc')
  }

  async findById(id: number): Promise<GuideSection | null> {
    return GuideSection.find(id)
  }

  async findByGuideId(guideId: number): Promise<GuideSection[]> {
    return GuideSection.query().where('guideId', guideId).orderBy('order', 'asc')
  }

  async create(data: GuideSectionCreateData): Promise<GuideSection> {
    return GuideSection.create(data)
  }

  async createMany(sections: GuideSectionCreateData[]): Promise<GuideSection[]> {
    return GuideSection.createMany(sections)
  }

  async update(id: number, data: GuideSectionUpdateData): Promise<GuideSection> {
    const guideSection = await GuideSection.findOrFail(id)
    guideSection.merge(data)
    await guideSection.save()
    return guideSection
  }

  async delete(id: number): Promise<void> {
    const guideSection = await GuideSection.findOrFail(id)
    await guideSection.delete()
  }

  async deleteByGuideId(guideId: number): Promise<void> {
    await GuideSection.query().where('guideId', guideId).delete()
  }

  async reorderSections(
    guideId: number,
    sectionOrders: Array<{ id: number; order: number }>
  ): Promise<void> {
    for (const { id, order } of sectionOrders) {
      await GuideSection.query().where('id', id).andWhere('guideId', guideId).update({ order })
    }
  }
}
