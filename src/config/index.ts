import dotenv from 'dotenv';

dotenv.config();

export const config={
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://admin:admin123@localhost:27017/inventory_db?authSource=admin',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    
    SALTS_ROUNDS: process.env.SALTS_ROUNDS ? parseInt(process.env.SALTS_ROUNDS) : 10,
    

};