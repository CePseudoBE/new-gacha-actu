import { BaseModelDto } from '@adocasts.com/dto/base'
import Image from '#models/image'

export default class ImageDto extends BaseModelDto {
  declare id: number
  declare filename: string
  declare path: string
  declare mimeType: string
  declare size: number
  declare altText: string | null
  declare createdAt: string
  declare updatedAt: string

  constructor(image?: Image) {
    super()

    if (!image) return
    this.id = image.id
    this.filename = image.filename
    this.path = image.path
    this.mimeType = image.mimeType
    this.size = image.size
    this.altText = image.altText
    this.createdAt = image.createdAt.toISO()!
    this.updatedAt = image.updatedAt.toISO()!
  }
}