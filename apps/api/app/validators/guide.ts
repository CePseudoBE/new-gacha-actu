import vine from '@vinejs/vine'
import Guide from '#models/guide'
import { DateTime } from 'luxon'
import GameDto from '#dtos/game'
import GuideTypeDto from '#dtos/guide_type'
import DifficultyLevelDto from '#dtos/difficulty_level'
import GuideSectionDto from '#dtos/guide_section'
import GuidePrerequisiteDto from '#dtos/guide_prerequisite'
import TagDto from '#dtos/tag'
import SeoKeywordDto from '#dtos/seo_keyword'

export const guideValidator = vine.compile(
  vine.object({
    id: vine.number(),
    title: vine.string().trim(),
    summary: vine.string().trim(),
    author: vine.string().trim(),
    publishedAt: vine.date({ formats: { utc: true } }),
    slug: vine.string().trim(),
    imageUrl: vine.string().trim().optional(),
    readingTime: vine.number().optional(),
    difficultyId: vine.number(),
    guideTypeId: vine.number(),
    isPopular: vine.boolean(),
    viewCount: vine.number(),
    gameId: vine.number(),
    metaDescription: vine.string().trim().optional(),
    createdAt: vine.date({ formats: { utc: true } }),
    updatedAt: vine.date({ formats: { utc: true } }),
    game: vine.object({}),
    guideType: vine.object({}),
    difficulty: vine.object({}),
    sections: vine.array(vine.object({})),
    prerequisites: vine.array(vine.object({})),
    tags: vine.array(vine.object({})),
    seoKeywords: vine.array(vine.object({})),
  })
)