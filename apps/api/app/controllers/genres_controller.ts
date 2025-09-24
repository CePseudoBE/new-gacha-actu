import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GenreService from '#services/genre_service'
import QueryValidationService from '#services/query_validation_service'
import {
  createGenreValidator,
  updateGenreValidator,
  genreParamsValidator,
} from '#validators/genre'

@inject()
export default class GenresController {
  constructor(private genreService: GenreService) {}

  async index(ctx: HttpContext) {
    const { page, perPage, filters } = await QueryValidationService.validateGenreFilters(ctx)
    const result = await this.genreService.getGenres(filters, page, perPage)

    return ctx.response.ok({
      success: true,
      data: result.data,
      meta: {
        pagination: result.meta,
      },
    })
  }

  async all({ response }: HttpContext) {
    const genres = await this.genreService.getAllGenres()

    return response.ok({
      success: true,
      data: genres,
    })
  }

  async show({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(genreParamsValidator)
    const genre = await this.genreService.getGenreById(validatedParams.id)

    if (!genre) {
      return response.notFound({
        success: false,
        error: 'Genre non trouvé',
      })
    }

    return response.ok({
      success: true,
      data: genre,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createGenreValidator)
    const genre = await this.genreService.createGenre(payload)

    return response.created({
      success: true,
      data: genre,
      message: 'Genre créé avec succès',
    })
  }

  async update({ request, response }: HttpContext) {
    const { params: validatedParams, ...payload } = await request.validateUsing(updateGenreValidator)
    const genre = await this.genreService.updateGenre(validatedParams.id, payload)

    return response.ok({
      success: true,
      data: genre,
      message: 'Genre mis à jour avec succès',
    })
  }

  async destroy({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(genreParamsValidator)
    await this.genreService.deleteGenre(validatedParams.id)

    return response.ok({
      success: true,
      message: 'Genre supprimé avec succès',
    })
  }

}