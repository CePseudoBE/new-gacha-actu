import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GenreService from '#services/genre_service'
import ResponseService from '#services/response_service'
import { createGenreValidator, genreParamsValidator, updateGenreValidator } from '#validators/genre'

@inject()
export default class GenresController {
  constructor(private genreService: GenreService) {}

  async index(ctx: HttpContext) {
    const genres = await this.genreService.getAllGenres()
    return ResponseService.ok(ctx, genres)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(genreParamsValidator)
    const genre = await this.genreService.getGenreById(validatedParams.id)
    return ResponseService.ok(ctx, genre)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createGenreValidator)
    const genre = await this.genreService.createGenre(payload)
    return ResponseService.created(ctx, genre, 'Genre créé avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } =
      await ctx.request.validateUsing(updateGenreValidator)
    const genre = await this.genreService.updateGenre(validatedParams.id, payload)
    return ResponseService.ok(ctx, genre, 'Genre mis à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(genreParamsValidator)
    await this.genreService.deleteGenre(validatedParams.id)
    return ResponseService.success(ctx, 'Genre supprimé avec succès')
  }
}
