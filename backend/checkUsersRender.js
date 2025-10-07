// scripts/checkUsersRender.js
const db = require('../config/database');

(async () => {
  try {
    console.log('🔍 Consultando tabla usuarios...');
    const result = await db.query('SELECT * FROM usuarios;');
    console.log('📋 Registros encontrados:', result.rows.length);
    console.table(result.rows);
  } catch (err) {
    console.error('❌ Error al consultar usuarios:', err.message);
  } finally {
    process.exit();
  }
})();
