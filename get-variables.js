// import fs from 'fs';
// import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// // Load environment variables from .env file
// dotenv.config();

// // Get the directory name of the current module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Get the current date in YYYYMMDD format
// const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
// const migrationFileName = `${currentDate}_bolt_saas_seed.sql`;

// // Read the SQL template file
// const sqlTemplate = fs.readFileSync(`${__dirname}/supabase/migrations/seed.sql`, 'utf8');

// // Replace placeholders with environment variables
// const sqlContent = sqlTemplate
//   .replace('{{VITE_DEFAULT_ADMIN_EMAIL}}', process.env.VITE_DEFAULT_ADMIN_EMAIL)
//   .replace('{{VITE_DEFAULT_ADMIN_PASSWORD}}', process.env.VITE_DEFAULT_ADMIN_PASSWORD);

// // Write the updated SQL content to a new migration file
// fs.writeFileSync(`${__dirname}/supabase/migrations/${migrationFileName}`, sqlContent);

// console.log(`Migration file created: ${migrationFileName}`);
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables from .env file
dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to migrations folder
const migrationsPath = path.join(__dirname, 'supabase/migrations');

// Delete all existing migrations
if (fs.existsSync(migrationsPath)) {
  fs.readdirSync(migrationsPath).forEach(file => {
    fs.unlinkSync(path.join(migrationsPath, file));
  });
  console.log('All existing migrations deleted.');
} else {
  fs.mkdirSync(migrationsPath, { recursive: true });
}

// Get the current date in YYYYMMDD format
const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
console.log(currentDate, 'dar')
const migrationFileName = `${currentDate}_bolt_saas_seed.sql`;

// Read the SQL template file
const seedFilePath = path.join(__dirname, 'supabase/seed.sql');
if (!fs.existsSync(seedFilePath)) {
  console.error('Error: seed.sql file not found!');
  process.exit(1);
}

const sqlTemplate = fs.readFileSync(seedFilePath, 'utf8');

// Replace placeholders with environment variables
const sqlContent = sqlTemplate
  .replace('{{VITE_DEFAULT_ADMIN_EMAIL}}', process.env.VITE_DEFAULT_ADMIN_EMAIL || '')
  .replace('{{VITE_DEFAULT_ADMIN_PASSWORD}}', process.env.VITE_DEFAULT_ADMIN_PASSWORD || '');

// Write the updated SQL content to a new migration file
const newMigrationPath = path.join(migrationsPath, migrationFileName);
fs.writeFileSync(newMigrationPath, sqlContent);

console.log(`New migration file created: ${migrationFileName}`);