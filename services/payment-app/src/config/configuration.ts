export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    port: parseInt(process.env.DATABASE_PORT, 10) || 27017,
    name: process.env.DATABASE_NAME || 'setelPayment'
  }
});
