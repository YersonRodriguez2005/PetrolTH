// config/database.js
const { Pool } = require('pg');
require('dotenv').config();

const isRender = process.env.RENDER === 'true' || process.env.DB_SSL === 'true';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: isRender ? { rejectUnauthorized: false } : false, // 👈 clave aquí
  connectionTimeoutMillis: 10000,
});

pool.connect()
  .then(client => {
    console.log('✅ Conexión establecida con PostgreSQL');
    client.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar con PostgreSQL:', err.message);
  });

module.exports = pool;
