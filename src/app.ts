import express,{Express,Request,Response} from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { errorHandlerMiddleware, httpLoggerMiddleware } from "./api/middlewares";
import { carRoutes, userRoutes, marcaRoutes, modeloRoutes, yearRoutes } from "./api/routes";
import { swaggerSpec } from "./infrastructure/web/express/swagger.config";
import { config } from "./config";

const app:Express=express()

// Middleware de logging HTTP (debe estar antes de las rutas)
app.use(httpLoggerMiddleware);

app.use(cors({
    origin: config.allowedOrigins,
    credentials: true
}));

app.use(express.json())
app.use(express.static("public"))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Inventory API Documentation'
}))

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Verificar estado del servidor
 *     description: Endpoint para verificar que el servidor está funcionando correctamente
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 */
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