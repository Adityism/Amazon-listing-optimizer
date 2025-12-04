const { Sequelize } = require('sequelize');
const config = require('../../config');

const { name, user, pass, host } = config.db;

if (!name || !user || !pass || !host) {
  module.exports = null;
} else {
  const sequelize = new Sequelize(name, user, pass, {
    host,
    dialect: 'mysql',
    logging: false,
  });

  module.exports = sequelize;
}
