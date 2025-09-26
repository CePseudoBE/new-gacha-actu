import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GuideService from '#services/guide_service'
import ImageService from '#services/image_service'
import ResponseService from '#services/response_service'
import GuideSection from '#models/guide_section'
import GuideSectionDto from '#dtos/guide_section'
import { NotFoundException } from '#exceptions/http_exceptions'
import {
  createGuideSectionValidator,
  guideSectionParamsValidator,
  updateGuideSectionValidator,
} from '#validators/guide_section'

@inject()
export default class GuideSectionsController {
  constructor(
    private guideService: GuideService,
    private imageService: ImageService
  ) {}

  async index(ctx: HttpContext) {
    const guideId = ctx.request.param('guideId')

    if (!guideId || Number.isNaN(Number(guideId))) {
      ResponseService.badRequest(ctx, 'ID du guide invalide')
      return
    }

    // Vérifier que le guide existe
    await this.guideService.getGuideById(Number(guideId))

    const sections = await GuideSection.query()
      .where('guideId', Number(guideId))
      .preload('image')
      .orderBy('order', 'asc')

    const sectionDtos = sections.map((section) => new GuideSectionDto(section))
    ResponseService.ok(ctx, sectionDtos)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(guideSectionParamsValidator)

    const section = await GuideSection.query()
      .where('id', validatedParams.id)
      .preload('image')
      .first()

    if (!section) {
      throw new NotFoundException('Section non trouvée')
    }

    ResponseService.ok(ctx, new GuideSectionDto(section))
  }

  async store(ctx: HttpContext) {
    const guideId = ctx.request.param('guideId')

    if (!guideId || Number.isNaN(Number(guideId))) {
      ResponseService.badRequest(ctx, 'ID du guide invalide')
      return
    }

    // Vérifier que le guide existe
    await this.guideService.getGuideById(Number(guideId))

    const payload = await ctx.request.validateUsing(createGuideSectionValidator)

    let imageId: number | undefined

    if (payload.image) {
      const uploadedImage = await this.imageService.uploadImage(payload.image)
      imageId = uploadedImage.id
    }

    const section = await GuideSection.create({
      title: payload.title,
      content: payload.content,
      order: payload.order,
      guideId: Number(guideId),
      imageId: imageId || null,
    })

    await section.load('image')

    ResponseService.created(ctx, new GuideSectionDto(section), 'Section créée avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } = await ctx.request.validateUsing(
      updateGuideSectionValidator
    )

    const section = await GuideSection.find(validatedParams.id)
    if (!section) {
      throw new NotFoundException('Section non trouvée')
    }

    let updateData: any = {}

    if (payload.title !== undefined) updateData.title = payload.title
    if (payload.content !== undefined) updateData.content = payload.content
    if (payload.order !== undefined) updateData.order = payload.order

    if (payload.image) {
      const uploadedImage = await this.imageService.uploadImage(payload.image)
      updateData.imageId = uploadedImage.id
    }

    section.merge(updateData)
    await section.save()
    await section.load('image')

    ResponseService.ok(ctx, new GuideSectionDto(section), 'Section mise à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(guideSectionParamsValidator)

    const section = await GuideSection.find(validatedParams.id)
    if (!section) {
      throw new NotFoundException('Section non trouvée')
    }

    await section.delete()
    ResponseService.success(ctx, 'Section supprimée avec succès')
  }
}
