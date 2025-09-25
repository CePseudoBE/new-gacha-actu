import { test } from '@japa/runner'
import type { HttpContext } from '@adonisjs/core/http'
import ResponseService from '#services/response_service'

test.group('ResponseService', () => {
  test('ok should call response.ok with correct data', ({ assert }) => {
    const testData = { id: 1, name: 'Test' }
    let calledWith: any = null

    const mockCtx = {
      response: {
        ok: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.ok(mockCtx, testData)

    assert.deepEqual(calledWith, {
      success: true,
      data: testData,
    })
  })

  test('ok should call response.ok with data and message', ({ assert }) => {
    const testData = { id: 1, name: 'Test' }
    const message = 'Success message'
    let calledWith: any = null

    const mockCtx = {
      response: {
        ok: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.ok(mockCtx, testData, message)

    assert.deepEqual(calledWith, {
      success: true,
      data: testData,
      message: message,
    })
  })

  test('okWithPagination should call response.ok with pagination meta', ({ assert }) => {
    const testData = [{ id: 1, name: 'Test' }]
    const pagination = {
      page: 1,
      perPage: 10,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    }
    let calledWith: any = null

    const mockCtx = {
      response: {
        ok: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.okWithPagination(mockCtx, testData, pagination)

    assert.deepEqual(calledWith, {
      success: true,
      data: testData,
      meta: { pagination },
    })
  })

  test('created should call response.created with default message', ({ assert }) => {
    const testData = { id: 1, name: 'Test' }
    let calledWith: any = null

    const mockCtx = {
      response: {
        created: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.created(mockCtx, testData)

    assert.deepEqual(calledWith, {
      success: true,
      data: testData,
      message: 'Ressource créée avec succès',
    })
  })

  test('created should call response.created with custom message', ({ assert }) => {
    const testData = { id: 1, name: 'Test' }
    const message = 'Custom created message'
    let calledWith: any = null

    const mockCtx = {
      response: {
        created: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.created(mockCtx, testData, message)

    assert.deepEqual(calledWith, {
      success: true,
      data: testData,
      message: message,
    })
  })

  test('success should call response.ok with message only', ({ assert }) => {
    const message = 'Operation successful'
    let calledWith: any = null

    const mockCtx = {
      response: {
        ok: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.success(mockCtx, message)

    assert.deepEqual(calledWith, {
      success: true,
      message: message,
    })
  })

  test('notFound should call response.notFound with default message', ({ assert }) => {
    let calledWith: any = null

    const mockCtx = {
      response: {
        notFound: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.notFound(mockCtx)

    assert.deepEqual(calledWith, {
      success: false,
      error: 'Ressource non trouvée',
    })
  })

  test('notFound should call response.notFound with custom message', ({ assert }) => {
    const message = 'Custom not found message'
    let calledWith: any = null

    const mockCtx = {
      response: {
        notFound: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.notFound(mockCtx, message)

    assert.deepEqual(calledWith, {
      success: false,
      error: message,
    })
  })

  test('badRequest should call response.badRequest with default message', ({ assert }) => {
    let calledWith: any = null

    const mockCtx = {
      response: {
        badRequest: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.badRequest(mockCtx)

    assert.deepEqual(calledWith, {
      success: false,
      error: 'Requête invalide',
    })
  })

  test('badRequest should call response.badRequest with custom message', ({ assert }) => {
    const message = 'Custom bad request message'
    let calledWith: any = null

    const mockCtx = {
      response: {
        badRequest: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.badRequest(mockCtx, message)

    assert.deepEqual(calledWith, {
      success: false,
      error: message,
    })
  })

  test('conflict should call response.conflict with default message', ({ assert }) => {
    let calledWith: any = null

    const mockCtx = {
      response: {
        conflict: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.conflict(mockCtx)

    assert.deepEqual(calledWith, {
      success: false,
      error: "Conflit lors de l'opération",
    })
  })

  test('conflict should call response.conflict with custom message', ({ assert }) => {
    const message = 'Custom conflict message'
    let calledWith: any = null

    const mockCtx = {
      response: {
        conflict: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.conflict(mockCtx, message)

    assert.deepEqual(calledWith, {
      success: false,
      error: message,
    })
  })

  test('unprocessableEntity should call response.unprocessableEntity with default message', ({
    assert,
  }) => {
    let calledWith: any = null

    const mockCtx = {
      response: {
        unprocessableEntity: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.unprocessableEntity(mockCtx)

    assert.deepEqual(calledWith, {
      success: false,
      error: 'Données non traitables',
    })
  })

  test('unprocessableEntity should call response.unprocessableEntity with custom message', ({
    assert,
  }) => {
    const message = 'Custom unprocessable entity message'
    let calledWith: any = null

    const mockCtx = {
      response: {
        unprocessableEntity: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.unprocessableEntity(mockCtx, message)

    assert.deepEqual(calledWith, {
      success: false,
      error: message,
    })
  })

  test('internalServerError should call response.internalServerError with default message', ({
    assert,
  }) => {
    let calledWith: any = null

    const mockCtx = {
      response: {
        internalServerError: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.internalServerError(mockCtx)

    assert.deepEqual(calledWith, {
      success: false,
      error: 'Erreur interne du serveur',
    })
  })

  test('internalServerError should call response.internalServerError with custom message', ({
    assert,
  }) => {
    const message = 'Custom internal server error message'
    let calledWith: any = null

    const mockCtx = {
      response: {
        internalServerError: (data: any) => {
          calledWith = data
        },
      },
    } as any

    ResponseService.internalServerError(mockCtx, message)

    assert.deepEqual(calledWith, {
      success: false,
      error: message,
    })
  })
})