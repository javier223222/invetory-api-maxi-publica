
import { DataSource } from "typeorm";
import { config } from "../../config";
import { Car,Marca,Modelo,User } from "core/entities";
import { logger } from "../services";

export const AppDataSource=new DataSource({
    type:"mongodb",
    url:config.mongoUri,
    
    synchronize:true,
    logging:false,
    entities:[User,Car,Marca,Modelo],
    migrations:[],
    subscribers:[],

});

export async function initializeDatabase() {
    try{
        if(!AppDataSource.isInitialized){
            const startTime = Date.now();
            await AppDataSource.initialize();
            const duration = Date.now() - startTime;
            
            logger.info('Database connection established successfully', {
                type: 'mongodb',
                duration: `${duration}ms`,
                database: config.mongoUri.split('/').pop()?.split('?')[0] || 'unknown',
            });
        }
    }catch(error){
        logger.error('Database initialization failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
        process.exit(1)
    }
    
}