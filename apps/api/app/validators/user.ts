import vine from '@vinejs/vine'

export const userValidator = vine.compile(
  vine.object({
    id: vine.number(),
    fullName: vine.string().trim().optional(),
    email: vine.string().trim(),
    password: vine.string().trim(),
    createdAt: vine.date({ formats: { utc: true } }),
    updatedAt: vine.date({ formats: { utc: true } }).optional(),
  })
)
