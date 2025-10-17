import express,{Express,Request,Response} from "express";
import cors from "cors";
import { errorHandlerMiddleware } from "api/middlewares";
import { carRoutes, userRoutes, marcaRoutes, modeloRoutes, yearRoutes } from "api/routes";

const app:Express=express()

app.use(cors());
app.use(express.json())
app.use(express.static("public"))


app.get("/api/health",(req:Request,res:Response)=>{
    res.status(200).json({
        status:"UP"
    })
})

app.use("/api/autos",carRoutes)
app.use("/api/usuarios",userRoutes)
app.use("/api/marcas",marcaRoutes)
app.use("/api/modelos",modeloRoutes)
app.use("/api/years",yearRoutes)

app.use(errorHandlerMiddleware)
export default app