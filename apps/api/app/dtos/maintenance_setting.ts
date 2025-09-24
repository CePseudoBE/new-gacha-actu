import { BaseModelDto } from '@adocasts.com/dto/base'
import MaintenanceSetting from '#models/maintenance_setting'

export default class MaintenanceSettingDto extends BaseModelDto {
  declare id: number
  declare isEnabled: boolean
  declare message: string
  declare estimatedEndTime: string | null
  declare allowAdminAccess: boolean
  declare createdAt: string
  declare updatedAt: string

  constructor(maintenanceSetting?: MaintenanceSetting) {
    super()

    if (!maintenanceSetting) return
    this.id = maintenanceSetting.id
    this.isEnabled = maintenanceSetting.isEnabled
    this.message = maintenanceSetting.message
    this.estimatedEndTime = maintenanceSetting.estimatedEndTime?.toISO() ?? null
    this.allowAdminAccess = maintenanceSetting.allowAdminAccess
    this.createdAt = maintenanceSetting.createdAt.toISO()!
    this.updatedAt = maintenanceSetting.updatedAt.toISO()!
  }
}
