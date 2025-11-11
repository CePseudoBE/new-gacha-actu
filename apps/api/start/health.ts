import { HealthChecks, DiskSpaceCheck, MemoryHeapCheck } from '@adonisjs/core/health'
import { DbCheck, DbConnectionCountCheck } from '@adonisjs/lucid/database'
import { RedisCheck, RedisMemoryUsageCheck } from '@adonisjs/redis'

export const healthChecks = new HealthChecks().register([
  // System checks
  new DiskSpaceCheck(),
  new MemoryHeapCheck(),

  // Database checks
  new DbCheck(),
  new DbConnectionCountCheck(),

  // Redis checks
  new RedisCheck(),
  new RedisMemoryUsageCheck(),
])