const Optimization = require('./Optimization');
const fs = require('fs').promises;
const path = require('path');

const JSON_DB_PATH = path.join(__dirname, 'db.json');

async function readJsonDb() {
  try {
    const data = await fs.readFile(JSON_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeJsonDb(data) {
  await fs.writeFile(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

async function saveOptimization(data) {
  if (Optimization) {
    return Optimization.create({
      ...data,
      original_bullets: JSON.stringify(data.original_bullets || []),
      optimized_bullets: JSON.stringify(data.optimized_bullets || []),
      keywords: JSON.stringify(data.keywords || []),
    });
  }
  
  const db = await readJsonDb();
  const newRecord = {
    id: db.length + 1,
    ...data,
    created_at: new Date().toISOString(),
  };
  db.unshift(newRecord);
  await writeJsonDb(db);
  return newRecord;
}

async function listOptimizations({ asin } = {}) {
  if (Optimization) {
    const queryOptions = { order: [['created_at', 'DESC']] };
    if (asin) {
      queryOptions.where = { asin };
    }
    return Optimization.findAll(queryOptions);
  }

  const db = await readJsonDb();
  if (!asin) {
    return db;
  }
  return db.filter(record => record.asin === asin);
}

module.exports = {
  saveOptimization,
  listOptimizations,
};
