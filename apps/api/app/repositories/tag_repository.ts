import Tag from '#models/tag'

export interface TagCreateData {
  name: string
}

export interface TagUpdateData extends Partial<TagCreateData> {}

export default class TagRepository {
  async findAll(): Promise<Tag[]> {
    return Tag.query().orderBy('name', 'asc')
  }

  async findById(id: number): Promise<Tag | null> {
    return Tag.find(id)
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    return Tag.query().where('slug', slug).first()
  }

  async create(data: TagCreateData): Promise<Tag> {
    return Tag.create(data)
  }

  async update(id: number, data: TagUpdateData): Promise<Tag> {
    const tag = await Tag.findOrFail(id)
    tag.merge(data)
    await tag.save()
    return tag
  }

  async delete(id: number): Promise<void> {
    const tag = await Tag.findOrFail(id)
    await tag.delete()
  }
}
