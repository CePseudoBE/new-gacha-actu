import vine from '@vinejs/vine'

export const articleValidator = vine.compile(
  vine.object({
    id: vine.number(),
    title: vine.string().trim(),
    summary: vine.string().trim(),
    author: vine.string().trim(),
    publishedAt: vine.date({ formats: { utc: true } }),
    slug: vine.string().trim(),
    imageUrl: vine.string().trim().optional(),
    content: vine.string().trim(),
    metaDescription: vine.string().trim().optional(),
    readingTime: vine.number().optional(),
    categoryId: vine.number().optional(),
    isPopular: vine.boolean(),
    gameId: vine.number(),
    createdAt: vine.date({ formats: { utc: true } }),
    updatedAt: vine.date({ formats: { utc: true } }),
    game: vine.object({}),
    category: vine.object({}),
    tags: vine.array(vine.object({})),
    seoKeywords: vine.array(vine.object({})),
  })
)
