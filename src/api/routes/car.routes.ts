import {Router,Request,Response, NextFunction} from "express";
import { CarController, } from "api/controllers";
import { validate, authMiddleware } from "api/middlewares";
import { upload } from "api/middlewares";
import { createCarSchema,carFilterSchema,updateCarSchema } from "api/dtos";

const router: Router = Router();
const carController = new CarController();
router.use(authMiddleware);

/**
 * @swagger
 * /api/autos:
 *   post:
 *     tags: [Cars]
 *     summary: Crear un nuevo auto
 *     description: Crea un nuevo auto en el inventario (requiere autenticación)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - marca
 *               - modelo
 *               - anio
 *               - precio
 *               - kilometraje
 *               - email
 *               - telefono
 *             properties:
 *               marca:
 *                 type: string
 *                 description: Marca del auto
 *                 example: Toyota
 *               modelo:
 *                 type: string
 *                 description: Modelo del auto
 *                 example: Corolla
 *               anio:
 *                 type: number
 *                 minimum: 1900
 *                 description: Año del auto
 *                 example: 2023
 *               precio:
 *                 type: number
 *                 minimum: 0
 *                 description: Precio del auto
 *                 example: 25000
 *               kilometraje:
 *                 type: number
 *                 minimum: 100
 *                 description: Kilometraje del auto
 *                 example: 15000
 *               color:
 *                 type: string
 *                 description: Color del auto
 *                 example: Rojo
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de contacto
 *                 example: vendedor@example.com
 *               telefono:
 *                 type: string
 *                 pattern: '^(\d{3}-\d{3}-\d{4}|\d{10})$'
 *                 description: Teléfono (formato 9611879041 o 961-187-9041)
 *                 example: 9611879041
 *               fotografia:
 *                 type: string
 *                 format: binary
 *                 description: Foto del auto (opcional)
 *     responses:
 *       201:
 *         description: Auto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarResponse'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *              application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorServer'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseUnauthorized'
 */
router.post(
    "/",
    
    upload.single("fotografia"),
    validate(createCarSchema,"body"),
    (req:Request,res:Response,next:NextFunction)=>carController.create(req,res,next)
);

/**
 * @swagger
 * /api/autos/{id}/fotografia:
 *   post:
 *     tags: [Cars]
 *     summary: Actualizar fotografía del auto
 *     description: Actualiza la fotografía de un auto existente (requiere autenticación)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del auto
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fotografia
 *             properties:
 *               fotografia:
 *                 type: string
 *                 format: binary
 *                 description: Nueva foto del auto
 *     responses:
 *       200:
 *         description: Fotografía actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarResponseUpdate'

 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *              application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorServer'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseUnauthorized'
 */
router.post(
    "/:id/fotografia",
    
    upload.single("fotografia"),
    (req:Request,res:Response,next:NextFunction)=>carController.updatePhoto(req,res,next)
)

/**
 * @swagger
 * /api/autos/{id}:
 *   put:
 *     tags: [Cars]
 *     summary: Actualizar auto
 *     description: Actualiza los datos de un auto existente (requiere autenticación)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del auto
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:
 *                 type: string
 *                 example: Toyota
 *               modelo:
 *                 type: string
 *                 example: Corolla
 *               anio:
 *                 type: number
 *                 example: 2023
 *               precio:
 *                 type: number
 *                 example: 25000
 *               kilometraje:
 *                 type: number
 *                 example: 15000
 *               color:
 *                 type: string
 *                 example: Rojo
 *               email:
 *                 type: string
 *                 example: vendedor@example.com
 *               telefono:
 *                 type: string
 *                 example: 9611879041
 *     responses:
 *       200:
 *         description: Carro actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarResponseUpdate'

 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *              application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorServer'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseUnauthorized'
 */
router.put(
    "/:id",
   
    validate(updateCarSchema,"body"),
    (req:Request,res:Response,next:NextFunction)=>carController.update(req,res,next)
)

/**
 * @swagger
 * /api/autos/{id}:
 *   delete:
 *     tags: [Cars]
 *     summary: Eliminar auto
 *     description: Elimina (soft delete) un auto del inventario (requiere autenticación)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del auto
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Auto eliminado exitosamente
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *              application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorServer'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseUnauthorized'
 */
router.delete(
    "/:id",
    (req:Request,res:Response,next:NextFunction)=>carController.delete(req,res,next)
)

/**
 * @swagger
 * /api/autos/{id}:
 *   get:
 *     tags: [Cars]
 *     summary: Obtener auto por ID
 *     description: Retorna los detalles de un auto específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del auto
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Carro encontrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Car found
 *                 data:
 *                   $ref: '#/components/schemas/Car'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *              application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorServer'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseUnauthorized'
 */
router.get(
    "/:id",
   
    (req:Request,res:Response,next:NextFunction)=>carController.findById(req,res,next)
);

/**
 * @swagger
 * /api/autos:
 *   get:
 *     tags: [Cars]
 *     summary: Listar autos con filtros y paginación
 *     description: Retorna una lista paginada de autos con opciones de filtrado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Número de página
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Cantidad de elementos por página
 *         example: 10
 *       - in: query
 *         name: marca
 *         schema:
 *           type: string
 *         description: Filtrar por marca
 *         example: Toyota
 *       - in: query
 *         name: modelo
 *         schema:
 *           type: string
 *         description: Filtrar por modelo
 *         example: Corolla
 *       - in: query
 *         name: anio
 *         schema:
 *           type: number
 *         description: Filtrar por año
 *         example: 2023
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filtrar por color
 *         example: Rojo
 *       - in: query
 *         name: precioMin
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *         example: 10000
 *       - in: query
 *         name: precioMax
 *         schema:
 *           type: number
 *         description: Precio máximo
 *         example: 50000
 *     responses:
 *       200:
 *         description: Lista de autos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Cars retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/PaginatedResponse'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *              application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorServer'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseUnauthorized'
 */
router.get(
    "/",
    validate(carFilterSchema,"query"),
    (req:Request,res:Response,next:NextFunction)=>carController.findAll(req,res,next)
);

export default router;
