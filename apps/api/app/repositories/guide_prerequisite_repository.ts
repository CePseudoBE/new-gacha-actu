import GuidePrerequisite from '#models/guide_prerequisite'

export interface GuidePrerequisiteCreateData {
  description: string
  guideId: number
}

export interface GuidePrerequisiteUpdateData extends Partial<GuidePrerequisiteCreateData> {}

export default class GuidePrerequisiteRepository {
  async findAll(): Promise<GuidePrerequisite[]> {
    return GuidePrerequisite.query().orderBy('id', 'asc')
  }

  async findById(id: number): Promise<GuidePrerequisite | null> {
    return GuidePrerequisite.find(id)
  }

  async findByGuideId(guideId: number): Promise<GuidePrerequisite[]> {
    return GuidePrerequisite.query().where('guideId', guideId).orderBy('id', 'asc')
  }

  async create(data: GuidePrerequisiteCreateData): Promise<GuidePrerequisite> {
    return GuidePrerequisite.create(data)
  }

  async createMany(prerequisites: GuidePrerequisiteCreateData[]): Promise<GuidePrerequisite[]> {
    return GuidePrerequisite.createMany(prerequisites)
  }

  async update(id: number, data: GuidePrerequisiteUpdateData): Promise<GuidePrerequisite> {
    const guidePrerequisite = await GuidePrerequisite.findOrFail(id)
    guidePrerequisite.merge(data)
    await guidePrerequisite.save()
    return guidePrerequisite
  }

  async delete(id: number): Promise<void> {
    const guidePrerequisite = await GuidePrerequisite.findOrFail(id)
    await guidePrerequisite.delete()
  }

  async deleteByGuideId(guideId: number): Promise<void> {
    await GuidePrerequisite.query().where('guideId', guideId).delete()
  }
}
