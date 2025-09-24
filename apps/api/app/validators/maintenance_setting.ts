import vine from '@vinejs/vine'

export const updateMaintenanceSettingValidator = vine.compile(
  vine.object({
    isEnabled: vine.boolean().optional(),
    message: vine.string().trim().minLength(1).maxLength(500).optional(),
    estimatedEndTime: vine.date({ formats: { utc: true } }).optional().nullable(),
    allowAdminAccess: vine.boolean().optional(),
  })
)

export const enableMaintenanceValidator = vine.compile(
  vine.object({
    message: vine.string().trim().minLength(1).maxLength(500).optional(),
  })
)