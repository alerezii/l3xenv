// Ejemplo profesional de uso de l3xenv
// --------------------------------------
// Este ejemplo muestra cómo cargar variables de entorno de forma segura y profesional
// usando l3xenv, con validaciones, valores por defecto y manejo de errores.

const env = require('../l3xenv');

// 1. Cargar el archivo .env principal
const result = env.config();
if (result.error) {
  console.error('Error cargando .env:', result.error.message);
  process.exit(1);
}

// 2. Cargar un archivo .env adicional (por ejemplo, para desarrollo local)
// env.config({ path: '.env.local' });

// 3. Obtener variables de entorno con validación y valores por defecto
const NODE_ENV = env.getString('NODE_ENV', {
  default: 'production',
  choices: ['production', 'development', 'test'],
  required: true
});

const API_URL = env.getString('API_URL', { required: true });
const PORT = env.getNumber('PORT', { default: 3000, min: 1, max: 65535 });
const DEBUG = env.getBoolean('DEBUG', { default: false });
const DB_HOST = env.getString('DB_HOST', { default: 'localhost' });
const DB_USER = env.getString('DB_USER', { required: true });
const DB_PASS = env.getString('DB_PASS', { required: true });
const LOG_LEVEL = env.getString('LOG_LEVEL', { default: 'info', choices: ['info', 'warn', 'error', 'debug'] });
const ENABLE_CACHE = env.getBoolean('ENABLE_CACHE', { default: false });
const MAX_CONNECTIONS = env.getNumber('MAX_CONNECTIONS', { default: 100, min: 1 });
const ALLOWED_ORIGINS = env.getArray('ALLOWED_ORIGINS', { default: ['localhost'] });

// 4. Validar que ciertas variables existan
try {
  env.require(['API_URL', 'DB_USER', 'DB_PASS']);
} catch (e) {
  console.error('Error de configuración:', e.message);
  process.exit(1);
}

// 6. Uso profesional en la app
console.log(`Servidor iniciado en ${API_URL}:${PORT} [${NODE_ENV}]`);
console.log('Base de datos:', DB_HOST, DB_USER);
console.log('Nivel de logs:', LOG_LEVEL);
console.log('Cache habilitado:', ENABLE_CACHE);
console.log('Máx conexiones:', MAX_CONNECTIONS);
console.log('Orígenes permitidos:', ALLOWED_ORIGINS);
