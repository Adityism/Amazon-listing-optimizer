// scripts/test-db.js
const { saveOptimization, listOptimizations } = require('../src/db/optimizationHelpers');

async function testDatabase() {
  console.log('--- Database Functionality Test ---');

  const dummyRecord = {
    asin: 'B002QYW8C4',
    original_title: 'Original Title',
    original_bullets: ['bullet 1', 'bullet 2'],
    original_description: 'Original description.',
    optimized_title: 'Optimized Title',
    optimized_bullets: ['opt bullet 1', 'opt bullet 2'],
    optimized_description: 'Optimized description.',
    keywords: ['kw1', 'kw2', 'kw3'],
  };

  try {
    // 1. Save a record
    console.log('\n1. Attempting to save a dummy record...');
    const saved = await saveOptimization(dummyRecord);
    if (saved) {
      console.log('   Record saved successfully.');
      // The saved object might be a Sequelize instance or a plain object
      console.log('   Saved Record ID:', saved.id); 
    } else {
      console.log('   Save operation did not return a record. (This is expected if DB is not configured).');
    }

    // 2. List records for the ASIN
    console.log(`\n2. Attempting to list records for ASIN: ${dummyRecord.asin}...`);
    const records = await listOptimizations({ asin: dummyRecord.asin });
    
    if (records && records.length > 0) {
      console.log(`   Found ${records.length} record(s).`);
      console.log('   First record title:', records[0].original_title);
    } else {
      console.log('   No records found.');
    }

    // 3. List all records
    console.log('\n3. Attempting to list all records...');
    const allRecords = await listOptimizations();
    if (allRecords && allRecords.length > 0) {
        console.log(`   Found ${allRecords.length} total record(s).`);
    } else {
        console.log('   No records found.');
    }

  } catch (error) {
    console.error('An error occurred during the database test:', error);
  }

  console.log('\n--- Test Complete ---');
}

testDatabase();
