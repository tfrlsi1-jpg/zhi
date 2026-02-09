import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Import database query helper from backend src (one level up from migrations/)
import { query } from '../src/config/database.js';

dotenv.config();

const migrationsDir = './migrations';

async function runMigrations() {
  try {
    console.log('Starting migrations...');
    
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      
      console.log(`Running migration: ${file}`);
      await query(sql);
      console.log(`✓ Completed: ${file}`);
    }

    console.log('\n✓ All migrations completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

runMigrations();
