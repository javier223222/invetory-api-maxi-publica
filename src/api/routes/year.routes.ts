import { Router, Request, Response, NextFunction } from "express";
import { YearController } from "api/controllers";
import { authMiddleware } from "@api/middlewares/auth.middleware";

const router: Router = Router();
const yearController = new YearController();

router.use(authMiddleware);
/**
 * @swagger
 * /api/years:
 *   get:
 *     tags: [Years]
 *     summary: Obtener años disponibles
 *     description: Retorna el rango de años disponibles desde 1990 hasta el año actual
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Años obtenidos exitosamente
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
 *                   example: Available years retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/YearRange'
 */
router.get(
    "/",
    (req: Request, res: Response, next: NextFunction) => yearController.getAvailableYears(req, res, next)
);

export default router;
