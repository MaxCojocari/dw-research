export default () => ({
  environment: process.env.NODE_ENV || 'development',
  app: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
  },
  database: {
    shard_1: {
      host: process.env.POSTGRES_HOST_SHARD_1,
      port: process.env.POSTGRES_PORT_SHARD_1 || 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      db: process.env.POSTGRES_DB,
    },
    shard_2: {
      host: process.env.POSTGRES_HOST_SHARD_2,
      port: process.env.POSTGRES_PORT_SHARD_2 || 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      db: process.env.POSTGRES_DB,
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
