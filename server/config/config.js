// ==============
// Puerto
// ==============
process.env.PORT = process.env.PORT || 3000;

// ==============
// Entorno
// ==============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==============
// Base de Datos
// ==============
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ======================
// Expiración del token
// ======================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.ExpiraToken = 60 * 60 * 24 * 30;

// ======================
// SEED de autenticación
// ======================
process.env.SEED = 'este-es-el-seed-de-desarrollo';

// ===============================
// Configuracion ClientID google
// ===============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '189599946424-3tqptp0tkaedjhf05pp02uq4volo3add.apps.googleusercontent.com';