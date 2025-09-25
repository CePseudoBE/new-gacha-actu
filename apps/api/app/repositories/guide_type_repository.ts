import GuideType from '#models/guide_type'

export interface GuideTypeCreateData {
  name: string
  description?: string | null
}

export interface GuideTypeUpdateData extends Partial<GuideTypeCreateData> {}

export default class GuideTypeRepository {
  async findAll(): Promise<GuideType[]> {
    return GuideType.query().orderBy('name', 'asc')
  }

  async findById(id: number): Promise<GuideType | null> {
    return GuideType.find(id)
  }

  async create(data: GuideTypeCreateData): Promise<GuideType> {
    return GuideType.create(data)
  }

  async update(id: number, data: GuideTypeUpdateData): Promise<GuideType> {
    const guideType = await GuideType.findOrFail(id)
    guideType.merge(data)
    await guideType.save()
    return guideType
  }

  async delete(id: number): Promise<void> {
    const guideType = await GuideType.findOrFail(id)
    await guideType.delete()
  }
}
