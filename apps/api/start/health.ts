import { HealthChecks, DiskSpaceCheck, MemoryHeapCheck } from '@adonisjs/core/health'
import { DbCheck, DbConnectionCountCheck } from '@adonisjs/lucid/database'
import { RedisCheck, RedisMemoryUsageCheck } from '@adonisjs/redis'
import db from '@adonisjs/lucid/services/db'
import redis from '@adonisjs/redis/services/main'

export const healthChecks = new HealthChecks().register([
  // System checks
  new DiskSpaceCheck(),
  new MemoryHeapCheck(),

  // Database checks
  new DbCheck(db.connection()),
  new DbConnectionCountCheck(db.connection()),

  // Redis checks
  new RedisCheck(redis.connection()),
  new RedisMemoryUsageCheck(redis.connection()),
])