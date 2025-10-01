// Devuelve la ruta absoluta al .env de una subcarpeta
function subFolder(dirName) {
  return require('path').resolve(process.cwd(), dirName, '.env');
}
// l3xenv: dotenv compatible, pero mejorado
const fs = require('fs');
const path = require('path');

function parse(src) {
  const obj = {};
  src.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let val = match[2] || '';
      // Remove surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      // Expand variables
      val = val.replace(/\$\{([\w.-]+)\}/g, (_, k) => process.env[k] || obj[k] || '');
      obj[key] = val;
    }
  });
  return obj;
}

function config(options = {}) {
  let envPath = options.path;
  if (!envPath) {
    // Intentar buscar .env en la carpeta del script que llama a l3xenv
    // (require.main es el módulo principal que ejecuta el proceso)
    const mainDir = require.main && require.main.filename ? path.dirname(require.main.filename) : process.cwd();
    envPath = path.resolve(mainDir, '.env');
    // Si no existe, usar el .env en el cwd como fallback
    if (!fs.existsSync(envPath)) {
      envPath = path.resolve(process.cwd(), '.env');
    }
  }
  const encoding = options.encoding || 'utf8';
  try {
    const src = fs.readFileSync(envPath, { encoding });
    const parsed = parse(src);
    Object.keys(parsed).forEach(key => {
      if (!(key in process.env)) {
        process.env[key] = parsed[key];
      }
    });
    return { parsed };
  } catch (e) {
    return { error: e };
  }
}

// API mejorada
function getEnv(name, parser, options = {}) {
  let value = process.env[name];
  const isMissing = value === undefined || value === null || value === '';
  if (isMissing) {
    if ('default' in options) value = options.default;
    else if (options.required) throw new Error(`❌ Missing environment variable: ${name}`);
    else throw new Error(`❌ Missing environment variable: ${name}`);
  }
  let parsed;
  try {
    parsed = parser(value);
  } catch (err) {
    throw new Error(`❌ Invalid type for ${name} (expected ${options.type || 'string'})`);
  }
  if (options.choices && !options.choices.includes(parsed)) {
    throw new Error(`❌ Invalid value for ${name}: ${parsed}. Allowed: ${options.choices.join(', ')}`);
  }
  if (typeof parsed === 'number') {
    if (typeof options.min === 'number' && parsed < options.min) {
      throw new Error(`❌ Value for ${name} (${parsed}) is less than minimum (${options.min})`);
    }
    if (typeof options.max === 'number' && parsed > options.max) {
      throw new Error(`❌ Value for ${name} (${parsed}) is greater than maximum (${options.max})`);
    }
  }
  return parsed;
}

function getString(name, options = {}) {
  return getEnv(name, v => String(v), { ...options, type: 'string' });
}

function getNumber(name, options = {}) {
  return getEnv(name, v => {
    const num = Number(v);
    if (isNaN(num)) throw new Error();
    return num;
  }, { ...options, type: 'number' });
}

function getBoolean(name, options = {}) {
  return getEnv(name, v => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return Boolean(v);
    if (typeof v === 'string') {
      const val = v.trim().toLowerCase();
      if (val === 'true' || val === '1') return true;
      if (val === 'false' || val === '0') return false;
    }
    throw new Error();
  }, { ...options, type: 'boolean' });
}

function getJSON(name, options = {}) {
  return getEnv(name, v => {
    if (typeof v === 'object') return v;
    try {
      return JSON.parse(v);
    } catch {
      throw new Error();
    }
  }, { ...options, type: 'json' });
}

function getArray(name, options = {}) {
  return getEnv(name, v => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') return v.split(',').map(s => s.trim());
    throw new Error();
  }, { ...options, type: 'array' });
}

function has(name) {
  const v = process.env[name];
  return v !== undefined && v !== null && v !== '';
}


function requireVars(names) {
  names.forEach(name => {
    if (!has(name)) throw new Error(`❌ Missing environment variable: ${name}`);
  });
}

module.exports = {
  config,
  parse,
  getString,
  getNumber,
  getBoolean,
  getJSON,
  getArray,
  has,
  require: requireVars,
  subFolder,
};
