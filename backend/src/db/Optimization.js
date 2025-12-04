const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

if (!sequelize) {
  module.exports = null;
  return;
}

function parseJsonField(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

const Optimization = sequelize.define('Optimization', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  asin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  original_title: {
    type: DataTypes.STRING(1024),
    allowNull: false,
  },
  original_bullets: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return parseJsonField(this.getDataValue('original_bullets'));
    }
  },
  original_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  optimized_title: {
    type: DataTypes.STRING(1024),
    allowNull: false,
  },
  optimized_bullets: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return parseJsonField(this.getDataValue('optimized_bullets'));
    }
  },
  optimized_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  keywords: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return parseJsonField(this.getDataValue('keywords'));
    }
  },
}, {
  tableName: 'optimizations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Optimization;
