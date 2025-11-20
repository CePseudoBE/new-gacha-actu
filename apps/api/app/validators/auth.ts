import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

/**
 * Validator for user registration
 */
const registerValidatorBase = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(100),
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8).maxLength(255).confirmed(),
  })
)

registerValidatorBase.errorReporter = () => new CustomErrorReporter()
export const registerValidator = registerValidatorBase

/**
 * Validator for user login
 */
const loginValidatorBase = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string(),
  })
)

loginValidatorBase.errorReporter = () => new CustomErrorReporter()
export const loginValidator = loginValidatorBase

/**
 * Validator for changing password
 */
const changePasswordValidatorBase = vine.compile(
  vine.object({
    currentPassword: vine.string(),
    newPassword: vine.string().minLength(8).maxLength(255),
  })
)

changePasswordValidatorBase.errorReporter = () => new CustomErrorReporter()
export const changePasswordValidator = changePasswordValidatorBase
