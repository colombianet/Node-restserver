// ==============
// Puerto
// ==============

process.env.PORT = process.env.PORT || 3000;

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