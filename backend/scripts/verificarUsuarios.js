require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Script para verificar usuarios y contraseñas
async function verificarUsuarios() {
  try {
    console.log('\n=== Verificando Configuración ===\n');
    console.log('DB_HOST:', process.env.DB_HOST || '❌ NO DEFINIDO');
    console.log('DB_USER:', process.env.DB_USER || '❌ NO DEFINIDO');
    console.log('DB_NAME:', process.env.DB_NAME || '❌ NO DEFINIDO');
    console.log('DB_PORT:', process.env.DB_PORT || '3306');
    console.log('');
    
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
      console.log('❌ ERROR: Variables de entorno no configuradas correctamente');
      console.log('\nVerifica que el archivo .env exista en la carpeta backend/ con:');
      console.log('DB_HOST=localhost');
      console.log('DB_USER=root');
      console.log('DB_PASSWORD=');
      console.log('DB_NAME=solicitudes_ordenes');
      console.log('');
      process.exit(1);
    }
    
    console.log('=== Verificando Usuarios en Base de Datos ===\n');
    
    const [usuarios] = await db.query('SELECT * FROM usuarios');
    
    if (usuarios.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      console.log('\nEjecutar este SQL en phpMyAdmin:\n');
      
      const hashUsuario = await bcrypt.hash('Petrol1234*', 10);
      const hashAdmin = await bcrypt.hash('PetrolAdmin1234*', 10);
      
      console.log(`INSERT INTO usuarios (usuario, rol, password) VALUES`);
      console.log(`('usuario1', 'Usuario', '${hashUsuario}'),`);
      console.log(`('admin', 'Administrador', '${hashAdmin}');`);
      console.log('');
      
      process.exit(0);
    }
    
    console.log(`✅ Encontrados ${usuarios.length} usuarios:\n`);
    
    for (const user of usuarios) {
      console.log(`ID: ${user.id}`);
      console.log(`Usuario: ${user.usuario}`);
      console.log(`Rol: ${user.rol}`);
      console.log(`Hash Password: ${user.password.substring(0, 20)}...`);
      
      // Verificar contraseñas
      const password = user.rol === 'Administrador' ? 'PetrolAdmin1234*' : 'Petrol1234*';
      const isValid = await bcrypt.compare(password, user.password);
      
      console.log(`Contraseña "${password}": ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
      console.log('---\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n🔧 Solución:');
      console.log('1. Verifica que el archivo .env exista en backend/');
      console.log('2. Verifica las credenciales de MySQL en .env');
      console.log('3. Asegúrate que MySQL esté corriendo en XAMPP');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Solución:');
      console.log('1. Inicia MySQL en XAMPP Control Panel');
      console.log('2. Verifica que el puerto sea 3306');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n🔧 Solución:');
      console.log('1. Crea la base de datos "solicitudes_ordenes" en phpMyAdmin');
      console.log('2. Ejecuta el script database/schema.sql');
    }
    
    process.exit(1);
  }
}

verificarUsuarios();