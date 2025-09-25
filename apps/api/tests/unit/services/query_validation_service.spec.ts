import { test } from '@japa/runner'
import QueryValidationService from '#services/query_validation_service'

test.group('QueryValidationService', () => {
  test('should validate pagination params correctly', async ({ assert }) => {
    // Mock du contexte HTTP avec query params
    const mockContext = {
      request: {
        qs: () => ({
          page: '2',
          perPage: '15',
        }),
      },
    } as any

    const result = await QueryValidationService.validatePagination(mockContext)

    assert.equal(result.page, 2)
    assert.equal(result.perPage, 15)
  })

  test('should use default values when params are missing', async ({ assert }) => {
    const mockContext = {
      request: {
        qs: () => ({}),
      },
    } as any

    const result = await QueryValidationService.validatePagination(mockContext)

    assert.equal(result.page, 1)
    assert.equal(result.perPage, 20)
  })

  test('should validate game filters correctly', async ({ assert }) => {
    const mockContext = {
      request: {
        qs: () => ({
          page: '1',
          perPage: '10',
          search: 'genshin',
          isPopular: 'true',
          genreIds: ['1', '2'],
          platformIds: ['3', '4'],
        }),
      },
    } as any

    const result = await QueryValidationService.validateGameFilters(mockContext)

    assert.equal(result.page, 1)
    assert.equal(result.perPage, 10)
    assert.equal(result.filters.search, 'genshin')
    assert.equal(result.filters.isPopular, true)
    assert.deepEqual(result.filters.genreIds, [1, 2])
    assert.deepEqual(result.filters.platformIds, [3, 4])
  })

  test('should validate limit correctly', async ({ assert }) => {
    const mockContext = {
      request: {
        qs: () => ({
          limit: '25',
        }),
      },
    } as any

    const result = await QueryValidationService.validateLimit(mockContext)

    assert.equal(result.limit, 25)
  })

  test('should throw validation error for invalid params', async ({ assert }) => {
    const mockContext = {
      request: {
        qs: () => ({
          page: 'abc',
          perPage: '999',
        }),
      },
    } as any

    await assert.rejects(() => QueryValidationService.validatePagination(mockContext))
  })
})
