const bcrypt = require('bcryptjs');

// Script para generar contraseñas hasheadas
// Ejecutar con: node scripts/hashPasswords.js

const passwords = {
  usuario: 'Petrol1234*',
  admin: 'PetrolAdmin1234*'
};

async function hashPasswords() {
  console.log('\n=== Contraseñas Hasheadas ===\n');
  
  for (const [rol, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`${rol.toUpperCase()}:`);
    console.log(`  Contraseña: ${password}`);
    console.log(`  Hash: ${hash}\n`);
  }

  // Generar queries SQL de inserción
  const hashUsuario = await bcrypt.hash(passwords.usuario, 10);
  const hashAdmin = await bcrypt.hash(passwords.admin, 10);

  console.log('=== Queries SQL para Insertar ===\n');
  console.log(`-- Usuario normal`);
  console.log(`INSERT INTO usuarios (usuario, rol, password) VALUES ('usuario1', 'Usuario', '${hashUsuario}');\n`);
  
  console.log(`-- Administrador`);
  console.log(`INSERT INTO usuarios (usuario, rol, password) VALUES ('admin', 'Administrador', '${hashAdmin}');\n`);
}

hashPasswords().catch(console.error);