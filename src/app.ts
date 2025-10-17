import express,{Express,Request,Response} from "express";
import cors from "cors";
import { errorHandlerMiddleware } from "api/middlewares";
import { carRoutes } from "api/routes";

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
app.use(errorHandlerMiddleware)
export default app