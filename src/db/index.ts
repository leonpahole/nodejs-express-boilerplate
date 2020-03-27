import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import config from '../config';

export const sequelize = new Sequelize({
  dialect: config.database.dialect as Dialect,
  database: config.database.name,
  username: config.database.username,
  password: config.database.password,
  host: config.database.host,
  models: [__dirname + '/models']
});
