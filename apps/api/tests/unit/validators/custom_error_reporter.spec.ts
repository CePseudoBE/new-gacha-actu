import { test } from '@japa/runner'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

test.group('CustomErrorReporter Unit Tests', () => {
  test('should return 404 for exists rule on params field', async ({ assert }) => {
    const reporter = new CustomErrorReporter()

    // Simule une validation d'existence sur un paramètre
    const mockField = {
      wildCardPath: 'params.id',
      name: 'id'
    } as any

    reporter.report('Game not found', 'database.exists', mockField)

    assert.isTrue(reporter.hasErrors)
    assert.lengthOf(reporter.errors, 1)
    assert.equal(reporter.errors[0].status, 404)
    assert.equal(reporter.errors[0].rule, 'database.exists')
    assert.equal(reporter.errors[0].field, 'params.id')
  })

  test('should return 422 for exists rule on body field', async ({ assert }) => {
    const reporter = new CustomErrorReporter()

    // Simule une validation d'existence sur une donnée du body
    const mockField = {
      wildCardPath: 'genreIds.0',
      name: 'genreIds'
    } as any

    reporter.report('Genre does not exist', 'database.exists', mockField)

    assert.isTrue(reporter.hasErrors)
    assert.lengthOf(reporter.errors, 1)
    assert.equal(reporter.errors[0].status, 422)
    assert.equal(reporter.errors[0].rule, 'database.exists')
    assert.equal(reporter.errors[0].field, 'genreIds.0')
  })

  test('should return 422 for non-exists rules', async ({ assert }) => {
    const reporter = new CustomErrorReporter()

    const mockField = {
      wildCardPath: 'name',
      name: 'name'
    } as any

    reporter.report('Name is required', 'required', mockField)

    assert.isTrue(reporter.hasErrors)
    assert.lengthOf(reporter.errors, 1)
    assert.equal(reporter.errors[0].status, 422)
    assert.equal(reporter.errors[0].rule, 'required')
  })

  test('createError should return 404 ONLY when there are ONLY params exists errors', async ({ assert }) => {
    const reporter = new CustomErrorReporter()

    // SEULEMENT une erreur 404 sur params
    const mockParamsField = {
      wildCardPath: 'params.id',
      name: 'id'
    } as any

    reporter.report('Game not found', 'database.exists', mockParamsField)

    const error = reporter.createError()

    assert.equal((error as any).status, 404)
    assert.equal((error as any).code, 'E_NOT_FOUND')
    assert.lengthOf(error.messages, 1)
    assert.equal(error.messages[0].field, 'params.id')
  })

  test('createError should return 422 when there are mixed params and body errors', async ({ assert }) => {
    const reporter = new CustomErrorReporter()

    // Erreur 404 sur params
    const mockParamsField = {
      wildCardPath: 'params.id',
      name: 'id'
    } as any

    // Erreur 422 sur body
    const mockBodyField = {
      wildCardPath: 'name',
      name: 'name'
    } as any

    reporter.report('Game not found', 'database.exists', mockParamsField)
    reporter.report('Name is required', 'required', mockBodyField)

    const error = reporter.createError()

    assert.equal((error as any).status, 422)
    assert.equal((error as any).code, 'E_VALIDATION_ERROR')
    assert.lengthOf(error.messages, 2)
  })

  test('createError should return 422 when there are only validation errors', async ({ assert }) => {
    const reporter = new CustomErrorReporter()

    const mockField = {
      wildCardPath: 'name',
      name: 'name'
    } as any

    reporter.report('Name is required', 'required', mockField)

    const error = reporter.createError()

    assert.equal((error as any).status, 422)
    assert.equal((error as any).code, 'E_VALIDATION_ERROR')
    assert.lengthOf(error.messages, 1)
    assert.equal(error.messages[0].field, 'name')
  })

  test('should handle multiple errors correctly', async ({ assert }) => {
    const reporter = new CustomErrorReporter()

    const mockParamsField = {
      wildCardPath: 'params.slug',
      name: 'slug'
    } as any

    const mockBodyField1 = {
      wildCardPath: 'genreIds.0',
      name: 'genreIds'
    } as any

    const mockBodyField2 = {
      wildCardPath: 'name',
      name: 'name'
    } as any

    reporter.report('Game not found', 'database.exists', mockParamsField)
    reporter.report('Genre does not exist', 'database.exists', mockBodyField1)
    reporter.report('Name is too short', 'minLength', mockBodyField2)

    assert.lengthOf(reporter.errors, 3)

    // Vérifier les statuts
    const statuses = reporter.errors.map(err => err.status)
    assert.include(statuses, 404) // params error
    assert.include(statuses, 422) // body errors
  })
})