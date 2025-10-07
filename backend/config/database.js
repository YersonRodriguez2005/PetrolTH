// database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: { rejectUnauthorized: false }, // obligatorio para Render
  connectionTimeoutMillis: 10000,     // evita timeout en render
});

pool.connect()
  .then(client => {
    console.log('✅ Conexión establecida con PostgreSQL en Render');
    client.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar con PostgreSQL:', err.message);
  });

module.exports = pool;
