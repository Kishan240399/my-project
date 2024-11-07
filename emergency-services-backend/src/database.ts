import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';

const db: Database = new sqlite3.Database('./emergency_services.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY,
      name TEXT,
      specialization TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ambulances (
      id INTEGER PRIMARY KEY,
      name TEXT,
      description TEXT,
      location TEXT
    )
  `);
});

export default db;
