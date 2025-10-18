import "reflect-metadata";
import app from "../../../app";
import {config} from "../../../config";
import { initializeDatabase } from "../../database/data-source";
import { logger } from "../../services";

async function main() {
    try{
        logger.info(' Starting Inventory API Server...', {
            nodeEnv: config.nodeEnv,
            port: config.port,
        });

        await initializeDatabase();
        
        app.listen(config.port,()=>{
            logger.info(` Server running successfully`, {
                url: `http://localhost:${config.port}`,
                docs: `http://localhost:${config.port}/api-docs`,
                environment: config.nodeEnv,
            });
        });

    }catch(error){
        logger.error(' Failed to start server', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
        process.exit(1)
    }
}

main();