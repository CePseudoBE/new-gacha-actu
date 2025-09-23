import vine from '@vinejs/vine'
import MaintenanceSetting from '#models/maintenance_setting'
import { DateTime } from 'luxon'

export const maintenanceSettingValidator = vine.compile(
  vine.object({
    id: vine.string().trim(),
    isEnabled: vine.boolean(),
    message: vine.string().trim(),
    estimatedEndTime: vine.date({ formats: { utc: true } }).optional(),
    allowAdminAccess: vine.boolean(),
    enabledBy: vine.string().trim().optional(),
    disabledBy: vine.string().trim().optional(),
    createdAt: vine.date({ formats: { utc: true } }),
    updatedAt: vine.date({ formats: { utc: true } }),
  })
)