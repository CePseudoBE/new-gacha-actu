import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import MaintenanceSettingService from '#services/maintenance_setting_service'
import {
  enableMaintenanceValidator,
  updateMaintenanceSettingValidator,
} from '#validators/maintenance_setting'

@inject()
export default class MaintenanceSettingsController {
  constructor(private maintenanceSettingService: MaintenanceSettingService) {}

  async status({ response }: HttpContext) {
    const maintenanceSetting = await this.maintenanceSettingService.getCurrentStatus()

    return response.ok({
      success: true,
      data: maintenanceSetting,
    })
  }

  async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateMaintenanceSettingValidator)

    const { estimatedEndTime, ...restPayload } = payload

    const updateData = {
      ...restPayload,
      estimatedEndTime: estimatedEndTime ? DateTime.fromJSDate(estimatedEndTime) : undefined,
    }

    const maintenanceSetting = await this.maintenanceSettingService.updateMaintenance(updateData)

    return response.ok({
      success: true,
      data: maintenanceSetting,
      message: 'Configuration de maintenance mise à jour avec succès',
    })
  }

  async enable({ request, response }: HttpContext) {
    const payload = await request.validateUsing(enableMaintenanceValidator)
    const maintenanceSetting = await this.maintenanceSettingService.enableMaintenance(
      payload.message
    )

    return response.ok({
      success: true,
      data: maintenanceSetting,
      message: 'Maintenance activée avec succès',
    })
  }

  async disable({ response }: HttpContext) {
    const maintenanceSetting = await this.maintenanceSettingService.disableMaintenance()

    return response.ok({
      success: true,
      data: maintenanceSetting,
      message: 'Maintenance désactivée avec succès',
    })
  }
}
