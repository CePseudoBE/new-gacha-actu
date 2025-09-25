import MaintenanceSetting from '#models/maintenance_setting'
import { DateTime } from 'luxon'

export interface MaintenanceSettingUpdateData {
  isEnabled?: boolean
  message?: string
  estimatedEndTime?: DateTime | null
  allowAdminAccess?: boolean
}

export default class MaintenanceSettingRepository {
  private readonly MAINTENANCE_ID = 1

  async getCurrent(): Promise<MaintenanceSetting> {
    let maintenanceSetting = await MaintenanceSetting.find(this.MAINTENANCE_ID)

    if (!maintenanceSetting) {
      maintenanceSetting = await MaintenanceSetting.create({
        id: this.MAINTENANCE_ID,
        isEnabled: false,
        message: 'Site en maintenance',
        allowAdminAccess: true,
      })
    }

    return maintenanceSetting
  }

  async update(data: MaintenanceSettingUpdateData): Promise<MaintenanceSetting> {
    const maintenanceSetting = await this.getCurrent()
    maintenanceSetting.merge(data)
    await maintenanceSetting.save()
    return maintenanceSetting
  }
}
