import ArticleCategory from '#models/article_category'

export interface ArticleCategoryCreateData {
  name: string
  slug?: string
  description?: string
}

export interface ArticleCategoryUpdateData {
  name?: string
  slug?: string
  description?: string
}

export default class ArticleCategoryRepository {
  async findAll(): Promise<ArticleCategory[]> {
    return ArticleCategory.query().orderBy('name', 'asc')
  }

  async findById(id: number): Promise<ArticleCategory | null> {
    return ArticleCategory.query().where('id', id).preload('articles').first()
  }

  async findBySlug(slug: string): Promise<ArticleCategory | null> {
    return ArticleCategory.query().where('slug', slug).preload('articles').first()
  }

  async create(data: ArticleCategoryCreateData): Promise<ArticleCategory> {
    return ArticleCategory.create(data)
  }

  async update(id: number, data: ArticleCategoryUpdateData): Promise<ArticleCategory | null> {
    const category = await ArticleCategory.find(id)
    if (!category) {
      return null
    }

    category.merge(data)
    await category.save()

    return category
  }

  async delete(id: number): Promise<boolean> {
    const category = await ArticleCategory.find(id)
    if (!category) {
      return false
    }

    await category.delete()
    return true
  }
}
