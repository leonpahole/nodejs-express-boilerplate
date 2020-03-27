import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  throw new Error('.env file not found'!);
}

export default {
  port: parseInt(process.env.APP_PORT || '4000', 10),

  logs: {
    level: process.env.LOG_LEVEL || 'silly'
  },

  api: {
    prefix: '/api'
  },

  database: {
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
};
