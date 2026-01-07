import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import MaintenanceSettingService from '#services/maintenance_setting_service'
import ResponseService from '#services/response_service'
import {
  enableMaintenanceValidator,
  updateMaintenanceSettingValidator,
} from '#validators/maintenance_setting'

@inject()
export default class MaintenanceSettingsController {
  constructor(private maintenanceSettingService: MaintenanceSettingService) {}

  async status(ctx: HttpContext) {
    const maintenanceSetting = await this.maintenanceSettingService.getCurrentStatus()
    return ResponseService.ok(ctx, maintenanceSetting)
  }

  async update(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(updateMaintenanceSettingValidator)

    const { estimatedEndTime, ...restPayload } = payload

    const updateData = {
      ...restPayload,
      estimatedEndTime: estimatedEndTime ? DateTime.fromJSDate(estimatedEndTime) : undefined,
    }

    const maintenanceSetting = await this.maintenanceSettingService.updateMaintenance(updateData)
    return ResponseService.ok(
      ctx,
      maintenanceSetting,
      'Configuration de maintenance mise à jour avec succès'
    )
  }

  async enable(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(enableMaintenanceValidator)
    const maintenanceSetting = await this.maintenanceSettingService.enableMaintenance(
      payload.message
    )
    return ResponseService.ok(ctx, maintenanceSetting, 'Maintenance activée avec succès')
  }

  async disable(ctx: HttpContext) {
    const maintenanceSetting = await this.maintenanceSettingService.disableMaintenance()
    return ResponseService.ok(ctx, maintenanceSetting, 'Maintenance désactivée avec succès')
  }
}
