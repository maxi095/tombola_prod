import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRoutes from './routes/auth.routes.js';
import editionRoutes from './routes/edition.routes.js';
import sellerRoutes from './routes/seller.routes.js';
import clientRoutes from './routes/client.routes.js';
import personRoutes from './routes/person.routes.js';
import saleRoutes from './routes/sale.routes.js';
import installmentRoutes from './routes/installment.routes.js';
import bingoCardRoutes from './routes/bingoCard.routes.js';
import quotaRoutes from './routes/quota.routes.js';
import sellerPaymentRoutes from './routes/sellerPayment.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';


// Configuración para ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== DEBUGGING Y VERIFICACIONES =====
console.log('🔍 RAILWAY APP.JS DEBUG:');
console.log('📁 __dirname:', __dirname);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔗 PORT:', process.env.PORT);

const clientDistPath = path.join(__dirname, '../client/dist');
console.log('📁 Client dist path:', clientDistPath);
console.log('📁 Client dist exists:', fs.existsSync(clientDistPath));

if (fs.existsSync(clientDistPath)) {
  const files = fs.readdirSync(clientDistPath);
  console.log('📄 Files in dist:', files);
  
  const indexPath = path.join(clientDistPath, 'index.html');
  console.log('📄 index.html exists:', fs.existsSync(indexPath));
}

// ===== CORS CONFIGURATION =====
const corsOptions = {
    origin: function (origin, callback) {
        console.log('🔍 CORS origin check:', origin);
        
        // En producción, ser más permisivo para debugging
        if (process.env.NODE_ENV === 'production') {
            console.log('✅ CORS: Allowing all origins in production');
            return callback(null, true);
        }
        
        // En desarrollo
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:8080',
            process.env.RAILWAY_PUBLIC_DOMAIN,
            `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        ].filter(Boolean);
        
        console.log('🔍 Allowed origins:', allowedOrigins);
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('❌ CORS blocked:', origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true
};

// ===== MIDDLEWARES =====
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
    console.log('🔍 Health check accessed');
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        port: process.env.PORT,
        nodeEnv: process.env.NODE_ENV,
        clientDistExists: fs.existsSync(clientDistPath)
    });
});

// ===== API ROUTES =====
console.log('🔗 Setting up API routes...');

app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.use("/api", editionRoutes);
app.use('/api', sellerRoutes);
app.use('/api', clientRoutes);
app.use('/api', personRoutes);
app.use("/api", saleRoutes);
app.use("/api", installmentRoutes);
app.use("/api", bingoCardRoutes);
app.use("/api", quotaRoutes);
app.use("/api", sellerPaymentRoutes);
app.use("/api", dashboardRoutes);

// Ruta de prueba API
app.get('/api/test', (req, res) => {
    console.log('🔍 API test accessed');
    res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// ===== STATIC FILES (FRONTEND) =====
console.log('🔗 Setting up static files...');
if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath, {
        maxAge: '1d',
        etag: false
    }));
    console.log('✅ Static files configured from:', clientDistPath);
} else {
    console.log('❌ Static files directory not found:', clientDistPath);
}

// ===== SPA CATCH-ALL ROUTE (MUST BE LAST) =====
app.get('*', (req, res) => {
    console.log('🔍 SPA catch-all for:', req.url);
    
    // Don't serve SPA for API routes that failed
    if (req.url.startsWith('/api/')) {
        console.log('❌ API route not found:', req.url);
        return res.status(404).json({ error: 'API endpoint not found', path: req.url });
    }
    
    const indexPath = path.join(clientDistPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        console.log('✅ Serving index.html for:', req.url);
        res.sendFile(indexPath);
    } else {
        console.log('❌ index.html not found at:', indexPath);
        res.status(404).json({
            error: 'Frontend files not found',
            path: indexPath,
            exists: fs.existsSync(indexPath)
        });
    }
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
    console.error('💥 Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

export default app;
