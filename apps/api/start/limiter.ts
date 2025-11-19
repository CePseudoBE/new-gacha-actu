/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'
import env from '#start/env'

const isTest = env.get('NODE_ENV') === 'test'

/**
 * Global throttle: 60 requests per minute (unlimited in test)
 */
export const throttle = limiter.define('global', () => {
  return limiter.allowRequests(isTest ? 999999 : 60).every('1 minute')
})

/**
 * Auth register: 5 requests per 15 minutes (unlimited in test)
 */
export const throttleRegister = limiter.define('auth:register', () => {
  return limiter.allowRequests(isTest ? 999999 : 5).every('15 minutes')
})

/**
 * Auth login: 10 requests per 15 minutes (unlimited in test)
 */
export const throttleLogin = limiter.define('auth:login', () => {
  return limiter.allowRequests(isTest ? 999999 : 10).every('15 minutes')
})

/**
 * Change password: 3 requests per hour (unlimited in test)
 */
export const throttleChangePassword = limiter.define('auth:change-password', () => {
  return limiter.allowRequests(isTest ? 999999 : 3).every('1 hour')
})

/**
 * Admin write operations: 30 requests per minute (unlimited in test)
 */
export const throttleAdminWrite = limiter.define('admin:write', () => {
  return limiter.allowRequests(isTest ? 999999 : 30).every('1 minute')
})
