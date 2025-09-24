import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MaintenanceSetting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare isEnabled: boolean

  @column()
  declare message: string

  @column.dateTime()
  declare estimatedEndTime: DateTime | null

  @column()
  declare allowAdminAccess: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
