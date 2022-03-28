export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017',
    name: process.env.DATABASE_NAME || 'setelPayment'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  }
});
