const sequelize = require('./sequelize');
const Optimization = require('./Optimization');

async function initializeDatabase() {
  if (!sequelize) {
    console.log('Database not configured. Using JSON fallback.');
    return;
  }
  
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await Optimization.sync({ alter: true });
    console.log('Database tables synced.');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = initializeDatabase;
