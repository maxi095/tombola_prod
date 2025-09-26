import mongoose from 'mongoose';
import { MONGODB_URI } from './config.js';

export const connectDB = async () => {
  try {
    console.log('🔄 Intentando conectar a MongoDB...');
    console.log('🌐 URI utilizada:', MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'MongoDB Local');
    console.log('🔗 URI completa (primeros 50 chars):', MONGODB_URI.substring(0, 50) + '...');
    
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 segundos timeout
      socketTimeoutMS: 45000, // 45 segundos socket timeout
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ Error connecting to the database:', error.message);
    console.error('🔍 URI siendo utilizada:', MONGODB_URI.substring(0, 50) + '...');
    console.error('🔍 Tipo de URI:', MONGODB_URI.includes('mongodb+srv') ? 'Atlas' : 'Local');
    console.error('🔍 Variables de entorno disponibles:');
    console.error('   - MONGO_URI:', !!process.env.MONGO_URI);
    console.error('   - MONGODB_URI:', !!process.env.MONGODB_URI);
    console.error('   - MONGO_PUBLIC_URL:', !!process.env.MONGO_PUBLIC_URL);
    console.error('   - PORT:', process.env.PORT);
    
    process.exit(1);
  }
};

// Manejar desconexiones
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de MongoDB:', err);
});