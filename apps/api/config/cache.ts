import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, drivers, store } from '@adonisjs/cache'

const cacheConfig = defineConfig({
  default: env.get('CACHE_STORE', 'redis') as 'redis' | 'file' | 'memoryOnly',

  stores: {
    // Memory-only cache (for testing or single-server deployments)
    memoryOnly: store().useL1Layer(drivers.memory({ maxSize: '100mb' })),

    // File-based cache (fallback)
    file: store()
      .useL1Layer(drivers.memory({ maxSize: '50mb' }))
      .useL2Layer(
        drivers.file({
          directory: app.tmpPath('cache'),
        })
      ),

    // Redis cache (recommended for production with multi-server)
    redis: store()
      .useL1Layer(drivers.memory({ maxSize: '100mb' }))
      .useL2Layer(drivers.redis({ connectionName: 'main' }))
      .useBus(drivers.redisBus({ connectionName: 'main' })),
  },
})

export default cacheConfig

declare module '@adonisjs/cache/types' {
  interface CacheStores extends InferStores<typeof cacheConfig> {}
}
