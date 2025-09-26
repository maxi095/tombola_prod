import dotenv from 'dotenv';
dotenv.config();

// TEMPORAL: Hardcodeado para testing  
const HARDCODED_MONGO_URI = 'mongodb+srv://pereyramaxi095:Cz1Wick1eOFbviMW@tombola.ysuih4b.mongodb.net/?retryWrites=true&w=majority&appName=Tombola';

console.log('🔍 RAILWAY DEBUG - TODAS las variables de entorno:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN);

// Debug específico para BASE DE DATOS
console.log('--- DATABASE VARIABLES ---');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL value:', process.env.DATABASE_URL ? 'EXISTS' : 'UNDEFINED');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

// Ver TODAS las variables que contengan DATABASE
console.log('--- TODAS las variables DATABASE ---');
Object.keys(process.env).forEach(key => {
    if (key.toLowerCase().includes('database') || key.toLowerCase().includes('mongo')) {
        console.log(`${key}:`, process.env[key] ? 'EXISTS' : 'UNDEFINED');
    }
});

export const TOKEN_SECRET = process.env.JWT_SECRET || 'some secret key';
export const PORT = process.env.PORT || 4000;
export const FRONTEND_URL = process.env.FRONTEND_URL || `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` || 'http://localhost:4000';

// CAMBIO: Usar DATABASE_URL primero
export const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || HARDCODED_MONGO_URI;

console.log('🔗 MongoDB URI:', MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas ✅' : `LOCAL: ${MONGODB_URI}`);
console.log('🌐 Frontend URL final:', FRONTEND_URL);