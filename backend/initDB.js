// initDB.js
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // obligatorio en Render
});

const initDB = async () => {
  try {
    console.log("🛠️ Iniciando creación de tablas en PostgreSQL...");

    // =====================================================
    // PASO 1: Eliminar tablas si existen (respetando dependencias)
    // =====================================================
    await pool.query(`
      DROP TABLE IF EXISTS solicitudes_ordenes CASCADE;
      DROP TABLE IF EXISTS usuarios CASCADE;
    `);

    // =====================================================
    // PASO 2: Crear Tabla de Usuarios
    // =====================================================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        usuario VARCHAR(50) UNIQUE NOT NULL,
        rol VARCHAR(20) CHECK (rol IN ('Usuario', 'Administrador')) NOT NULL,
        password VARCHAR(255) NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Índices adicionales
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_usuario ON usuarios (usuario);
      CREATE INDEX IF NOT EXISTS idx_rol ON usuarios (rol);
    `);

    // =====================================================
    // PASO 3: Crear Tabla de Solicitudes y Órdenes
    // =====================================================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS solicitudes_ordenes (
        id SERIAL PRIMARY KEY,
        empleado VARCHAR(100) NOT NULL,
        tipo_solicitud VARCHAR(20) CHECK (tipo_solicitud IN ('Examen', 'Cursos', 'Dotación', 'Otros')) NOT NULL,
        numero_solicitud VARCHAR(50) UNIQUE,
        estado_solicitud VARCHAR(20) CHECK (estado_solicitud IN ('Pendiente', 'Aprobada', 'Anulada')) DEFAULT 'Pendiente',
        numero_orden VARCHAR(50) UNIQUE,
        estado_orden VARCHAR(20) CHECK (estado_orden IN ('Pendiente', 'Aprobada', 'Anulada')) DEFAULT 'Pendiente',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        creado_por VARCHAR(50) NOT NULL,
        actualizado_por VARCHAR(50) NOT NULL
      );
    `);

    // Índices adicionales
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_empleado ON solicitudes_ordenes (empleado);
      CREATE INDEX IF NOT EXISTS idx_tipo_solicitud ON solicitudes_ordenes (tipo_solicitud);
      CREATE INDEX IF NOT EXISTS idx_numero_solicitud ON solicitudes_ordenes (numero_solicitud);
      CREATE INDEX IF NOT EXISTS idx_estado_solicitud ON solicitudes_ordenes (estado_solicitud);
      CREATE INDEX IF NOT EXISTS idx_numero_orden ON solicitudes_ordenes (numero_orden);
      CREATE INDEX IF NOT EXISTS idx_estado_orden ON solicitudes_ordenes (estado_orden);
      CREATE INDEX IF NOT EXISTS idx_creado_por ON solicitudes_ordenes (creado_por);
      CREATE INDEX IF NOT EXISTS idx_fecha_creacion ON solicitudes_ordenes (fecha_creacion);
    `);

    // =====================================================
    // PASO 4: Insertar Usuarios Iniciales
    // =====================================================
    await pool.query(`
      INSERT INTO usuarios (usuario, rol, password)
      VALUES
        ('usuario1', 'Usuario', '$2a$10$HASH_GENERADO_AQUI'),
        ('admin', 'Administrador', '$2a$10$HASH_GENERADO_AQUI')
      ON CONFLICT (usuario) DO NOTHING;
    `);

    console.log("✅ Tablas creadas correctamente o ya existentes.");
  } catch (error) {
    console.error("❌ Error durante la inicialización:", error.message);
  } finally {
    await pool.end();
    console.log("🔒 Conexión cerrada.");
  }
};

initDB();
