import { Router, Request, Response, NextFunction } from "express";
import { ModeloController } from "api/controllers";
import { authMiddleware } from "@api/middlewares";

const router: Router = Router();
const modeloController = new ModeloController();
router.use(authMiddleware);

/**
 * @swagger
 * /api/modelos:
 *   get:
 *     tags: [Models]
 *     summary: Obtener todos los modelos
 *     description: Retorna una lista de todos los modelos de autos disponibles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de modelos obtenida exitosamente
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
 *                   example: Models retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Modelo'
 */
router.get(
    "/",
    (req: Request, res: Response, next: NextFunction) => modeloController.getAll(req, res, next)
);

/**
 * @swagger
 * /api/modelos/marca/{marcaId}:
 *   get:
 *     tags: [Models]
 *     summary: Obtener modelos por marca
 *     description: Retorna todos los modelos asociados a una marca específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: marcaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la marca
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Lista de modelos obtenida exitosamente
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
 *                   example: Models retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Modelo'
 *       400:
 *         description: ID de marca inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    "/marca/:marcaId",
    (req: Request, res: Response, next: NextFunction) => modeloController.getByMarca(req, res, next)
);

export default router;
