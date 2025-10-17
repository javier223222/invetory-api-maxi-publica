
import { DataSource } from "typeorm";
import { config } from "../../config";
import { Car,Marca,Modelo,User } from "core/entities";
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
            await AppDataSource.initialize()
            console.log("Conexion a mongoDb establecido correctamente")
        }
    }catch(error){
        console.error("Error durante la inicializacion de la base de datos: ")
        process.exit(1)
    }
    
}