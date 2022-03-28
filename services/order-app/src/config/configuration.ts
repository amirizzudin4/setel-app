export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017',
    name: process.env.DATABASE_NAME || 'setelOrder'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  }
});
