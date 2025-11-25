require('dotenv').config();

module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  PORT: process.env.DB_PORT || 5432,
  USER: process.env.DB_USER || "ws4sem",
  PASSWORD: process.env.DB_PASSWORD || "ws4sem123",
  DB: process.env.DB_NAME || "postgres",
  SCHEMA: process.env.DB_SCHEMA || "wslab5",
  dialect: "postgres",
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};