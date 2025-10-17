import "reflect-metadata";
import "tsconfig-paths/register";
import app from "app";
import {config} from "config";
import { initializeDatabase } from "infrastructure/database/data-source";

async function main() {
    try{

        await initializeDatabase()
        app.listen(config.port,()=>{
            console.log(`Servidor corriendo en http://localhost:${config.port}`  );
        })

    }catch(error){
        console.error("no se puedo inciar el servidor",error)
        process.exit(1)
    }
}

main();