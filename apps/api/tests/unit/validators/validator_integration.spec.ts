import { test } from '@japa/runner'
import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

test.group('Validator Integration with CustomErrorReporter', () => {
  test('debug: verify custom error reporter is being used', async ({ assert }) => {
    const reporter = new CustomErrorReporter()
    const mockField = { wildCardPath: 'params.id', name: 'id' } as any
    reporter.report('Test error', 'exists', mockField)

    const validator = vine.compile(
      vine.object({
        name: vine.string().minLength(10),
      })
    )

    validator.errorReporter = () => new CustomErrorReporter()

    try {
      await validator.validate({
        name: 'short'
      })
      assert.fail('Should have thrown validation error')
    } catch (error: any) {
      assert.isTrue(error.messages?.length > 0)
    }
  })

  test('should use custom error reporter for body validation', async ({ assert }) => {
    const validator = vine.compile(
      vine.object({
        genreIds: vine.array(vine.number().min(1).exists({ table: 'genres', column: 'id' }))
      })
    )

    validator.errorReporter = () => new CustomErrorReporter()

    try {
      await validator.validate({
        genreIds: [999999]
      })
      assert.fail('Should have thrown validation error')
    } catch (error: any) {
      assert.equal(error.status, 422)
      assert.equal(error.code, 'E_VALIDATION_ERROR')
    }
  })
})