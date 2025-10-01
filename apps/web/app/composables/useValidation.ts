import { z } from 'zod'

// Game validation schema (basé sur le validator backend)
export const gameSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  releaseDate: z.string().optional().nullable(),
  isPopular: z.boolean(),
  officialSite: z.union([z.string().url('URL invalide'), z.literal('')]).optional(),
  wiki: z.union([z.string().url('URL invalide'), z.literal('')]).optional(),
})

export type GameFormData = z.infer<typeof gameSchema>

// Article validation schema
export const articleSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  summary: z.string().min(10, 'Le résumé doit contenir au moins 10 caractères'),
  author: z.string().min(2, 'Le nom de l\'auteur doit contenir au moins 2 caractères'),
  publishedAt: z.string(),
  imageUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  content: z.string().min(50, 'Le contenu doit contenir au moins 50 caractères'),
  metaDescription: z.string().optional(),
  readingTime: z.number().int().positive().optional(),
  categoryId: z.number().optional(),
  isPopular: z.boolean().default(false),
  gameId: z.number({ required_error: 'Sélectionnez un jeu' }),
  tagIds: z.array(z.number()).optional(),
  seoKeywordIds: z.array(z.number()).optional(),
})

export type ArticleFormData = z.infer<typeof articleSchema>

// Guide validation schema
export const guideSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  summary: z.string().min(10, 'Le résumé doit contenir au moins 10 caractères'),
  author: z.string().min(2, 'Le nom de l\'auteur doit contenir au moins 2 caractères'),
  publishedAt: z.string(),
  imageUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  content: z.string().min(50, 'Le contenu doit contenir au moins 50 caractères'),
  metaDescription: z.string().optional(),
  viewCount: z.number().int().nonnegative().default(0),
  isPopular: z.boolean().default(false),
  gameId: z.number({ required_error: 'Sélectionnez un jeu' }),
  guideTypeId: z.number().optional(),
  difficultyId: z.number().optional(),
  tagIds: z.array(z.number()).optional(),
  seoKeywordIds: z.array(z.number()).optional(),
})

export type GuideFormData = z.infer<typeof guideSchema>
