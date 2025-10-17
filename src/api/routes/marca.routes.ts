import { Router, Request, Response, NextFunction } from "express";
import { MarcaController } from "api/controllers";
import { authMiddleware } from "@api/middlewares";

const router: Router = Router();
const marcaController = new MarcaController();
router.use(authMiddleware);


/**
 * @swagger
 * /api/marcas:
 *   get:
 *     tags: [Brands]
 *     summary: Obtener todas las marcas
 *     description: Retorna una lista de todas las marcas de autos disponibles ordenadas alfabéticamente
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de marcas obtenida exitosamente
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
 *                   example: Brands retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Marca'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    "/",
    (req: Request, res: Response, next: NextFunction) => marcaController.getAll(req, res, next)
);

export default router;
