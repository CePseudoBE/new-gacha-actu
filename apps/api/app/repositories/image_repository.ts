import { inject } from '@adonisjs/core'
import Image from '#models/image'

export interface ImageCreateData {
  filename: string
  mimetype: string
  size: number
  path: string
  altText?: string | null
}

export interface ImageUpdateData {
  altText?: string | null
}

@inject()
export default class ImageRepository {
  async findById(id: number): Promise<Image | null> {
    return await Image.find(id)
  }

  async create(data: ImageCreateData): Promise<Image> {
    return await Image.create({
      filename: data.filename,
      path: data.path,
      mimeType: data.mimetype,
      size: data.size,
      altText: data.altText || null,
    })
  }

  async update(id: number, data: ImageUpdateData): Promise<Image | null> {
    const image = await Image.find(id)
    if (!image) return null

    image.merge({
      altText: data.altText,
    })
    await image.save()
    return image
  }

  async delete(id: number): Promise<void> {
    const image = await Image.find(id)
    if (image) {
      await image.delete()
    }
  }
}
