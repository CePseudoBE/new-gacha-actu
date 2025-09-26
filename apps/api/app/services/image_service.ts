import { inject } from '@adonisjs/core'
import drive from '@adonisjs/drive/services/main'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import ImageRepository from '#repositories/image_repository'
import ImageDto from '#dtos/image'
import type { ImageCreateData } from '#repositories/image_repository'
import { NotFoundException } from '#exceptions/http_exceptions'

@inject()
export default class ImageService {
  constructor(private imageRepository: ImageRepository) {}

  async uploadImage(file: MultipartFile): Promise<ImageDto> {
    if (!file) {
      throw new Error('Aucun fichier fourni')
    }

    const fileName = `${cuid()}.${file.extname}`
    const filePath = `images/${fileName}`

    await file.moveToDisk(filePath)

    const imageData: ImageCreateData = {
      filename: fileName,
      mimetype: file.type || 'image/jpeg',
      size: file.size || 0,
      path: filePath,
    }

    const image = await this.imageRepository.create(imageData)
    return new ImageDto(image)
  }

  async getImageById(id: number): Promise<ImageDto> {
    const image = await this.imageRepository.findById(id)
    if (!image) {
      throw new NotFoundException('Image non trouvée')
    }
    return new ImageDto(image)
  }

  async deleteImage(id: number): Promise<void> {
    const image = await this.imageRepository.findById(id)
    if (!image) {
      throw new NotFoundException('Image non trouvée')
    }

    try {
      await drive.use().delete(image.path)
    } catch (error) {
      console.warn(`Impossible de supprimer le fichier physique: ${image.path}`, error)
    }

    await this.imageRepository.delete(id)
  }
}
