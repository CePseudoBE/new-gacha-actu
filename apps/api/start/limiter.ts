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

/**
 * Global throttle: 60 requests per minute
 */
export const throttle = limiter.define('global', () => {
  return limiter.allowRequests(60).every('1 minute')
})

/**
 * Auth register: 5 requests per 15 minutes
 */
export const throttleRegister = limiter.define('auth:register', () => {
  return limiter.allowRequests(5).every('15 minutes')
})

/**
 * Auth login: 10 requests per 15 minutes
 */
export const throttleLogin = limiter.define('auth:login', () => {
  return limiter.allowRequests(10).every('15 minutes')
})

/**
 * Change password: 3 requests per hour
 */
export const throttleChangePassword = limiter.define('auth:change-password', () => {
  return limiter.allowRequests(3).every('1 hour')
})

/**
 * Admin write operations: 30 requests per minute
 */
export const throttleAdminWrite = limiter.define('admin:write', () => {
  return limiter.allowRequests(30).every('1 minute')
})
