import { inject } from '@adonisjs/core'
import MaintenanceSettingRepository, {
  MaintenanceSettingUpdateData,
} from '#repositories/maintenance_setting_repository'
import MaintenanceSettingDto from '#dtos/maintenance_setting'

@inject()
export default class MaintenanceSettingService {
  constructor(private maintenanceSettingRepository: MaintenanceSettingRepository) {}

  async getCurrentStatus(): Promise<MaintenanceSettingDto> {
    const maintenanceSetting = await this.maintenanceSettingRepository.getCurrent()
    return new MaintenanceSettingDto(maintenanceSetting)
  }

  async updateMaintenance(data: MaintenanceSettingUpdateData): Promise<MaintenanceSettingDto> {
    const maintenanceSetting = await this.maintenanceSettingRepository.update(data)
    return new MaintenanceSettingDto(maintenanceSetting)
  }

  async enableMaintenance(message?: string): Promise<MaintenanceSettingDto> {
    const updateData: MaintenanceSettingUpdateData = { isEnabled: true }
    if (message) {
      updateData.message = message
    }
    return this.updateMaintenance(updateData)
  }

  async disableMaintenance(): Promise<MaintenanceSettingDto> {
    return this.updateMaintenance({ isEnabled: false })
  }
}