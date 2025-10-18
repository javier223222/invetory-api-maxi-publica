import dotenv from 'dotenv';
import Joi from 'joi';


dotenv.config();


const envSchema = Joi.object({
    
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .required()
        .description('Environment mode'),
    
    PORT: Joi.number()
        .port()
        .required()
        .description('Server port'),
    
   
    MONGO_URI: Joi.string()
        .uri()
        .required()
        .description('MongoDB connection URI'),
    
   
    JWT_SECRET: Joi.string()
        .min(32)
        .required()
        .description('JWT secret key (minimum 32 characters)'),
    
    JWT_EXPIRATION: Joi.string()
        .pattern(/^\d+[smhd]$/)
        .required()
        .description('JWT expiration time (e.g., 24h, 7d)'),
    
    SALTS_ROUNDS: Joi.number()
        .integer()
        .min(10)
        .max(15)
        .required()
        .description('Bcrypt salt rounds'),
    
   
    MAX_FILE_SIZE: Joi.number()
        .positive()
        .required()
        .description('Maximum file size in bytes'),
    
    ALLOWED_FILE_TYPES: Joi.string()
        .required()
        .description('Comma-separated list of allowed MIME types'),
    
   
    ALLOWED_ORIGINS: Joi.string()
        .required()
        .description('Comma-separated list of allowed origins'),
})
    .unknown(true) 
    .required();


const validateEnv = () => {
    const { error, value } = envSchema.validate(process.env, {
        abortEarly: false, 
        stripUnknown: true, 
    });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message).join('\n');
        throw new Error(` Environment validation failed:\n${errorMessages}`);
    }

    return value;
};


const env = validateEnv();


interface Config {
   
    nodeEnv: 'development' | 'production' | 'test';
    port: number;
    
    
    mongoUri: string;
    
    
    jwtSecret: string;
    jwtExpiration: string;
    saltRounds: number;
    
    
    maxFileSize: number;
    allowedFileTypes: string[];
    
    
    allowedOrigins: string[];
    
   
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
}


export const config: Config = {
    
    nodeEnv: env.NODE_ENV as 'development' | 'production' | 'test',
    port: env.PORT,
    
    
    mongoUri: env.MONGO_URI,
    
    
    jwtSecret: env.JWT_SECRET,
    jwtExpiration: env.JWT_EXPIRATION,
    saltRounds: env.SALTS_ROUNDS,
    
    
    maxFileSize: env.MAX_FILE_SIZE,
    allowedFileTypes: env.ALLOWED_FILE_TYPES.split(',').map((type: string) => type.trim()),
    
    
    allowedOrigins: env.ALLOWED_ORIGINS.split(',').map((origin: string) => origin.trim()),
    
    
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
};


// El logging de configuración se hará desde server.ts usando Winston
// para evitar dependencias circulares