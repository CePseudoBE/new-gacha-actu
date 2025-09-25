import SeoKeyword from '#models/seo_keyword'

export interface SeoKeywordCreateData {
  keyword: string
}

export interface SeoKeywordUpdateData extends Partial<SeoKeywordCreateData> {}

export default class SeoKeywordRepository {
  async findAll(): Promise<SeoKeyword[]> {
    return SeoKeyword.query().orderBy('keyword', 'asc')
  }

  async findById(id: number): Promise<SeoKeyword | null> {
    return SeoKeyword.find(id)
  }

  async create(data: SeoKeywordCreateData): Promise<SeoKeyword> {
    return SeoKeyword.create(data)
  }

  async update(id: number, data: SeoKeywordUpdateData): Promise<SeoKeyword> {
    const seoKeyword = await SeoKeyword.findOrFail(id)
    seoKeyword.merge(data)
    await seoKeyword.save()
    return seoKeyword
  }

  async delete(id: number): Promise<void> {
    const seoKeyword = await SeoKeyword.findOrFail(id)
    await seoKeyword.delete()
  }
}
