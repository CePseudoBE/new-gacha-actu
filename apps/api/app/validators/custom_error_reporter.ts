import type { ErrorReporterContract, FieldContext } from '@vinejs/vine/types'
import { errors } from '@vinejs/vine'

export class CustomErrorReporter implements ErrorReporterContract {
  hasErrors = false
  errors: Array<{
    field: string
    message: string
    rule: string
    status?: number
  }> = []

  report(message: string, rule: string, field: FieldContext, _meta?: any) {
    this.hasErrors = true

    let status: number | undefined

    if (rule === 'database.exists' && field.wildCardPath.includes('params.')) {
      status = 404
    } else {
      status = 422
    }

    this.errors.push({
      field: field.wildCardPath,
      message,
      rule,
      status,
    })
  }

  createError() {
    const notFoundErrors = this.errors.filter((error) => error.status === 404)
    const validationErrors = this.errors.filter((error) => error.status === 422)

    const vineErrors = this.errors.map((err) => ({
      field: err.field,
      message: err.message,
      rule: err.rule,
    }))

    const validationError = new errors.E_VALIDATION_ERROR(vineErrors)

    if (notFoundErrors.length > 0 && validationErrors.length === 0) {
      ;(validationError as any).status = 404
      ;(validationError as any).code = 'E_NOT_FOUND'
      validationError.messages = notFoundErrors.map((err) => ({
        field: err.field,
        message: err.message,
        rule: err.rule,
      }))
    }

    return validationError
  }
}
