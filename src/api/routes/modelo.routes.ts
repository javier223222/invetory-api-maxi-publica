import { Router, Request, Response, NextFunction } from "express";
import { ModeloController } from "api/controllers";
import { authMiddleware } from "@api/middlewares/auth.middleware";

const router: Router = Router();
const modeloController = new ModeloController();

router.use(authMiddleware);
router.get(
    "/",
    (req: Request, res: Response, next: NextFunction) => modeloController.getAll(req, res, next)
);

router.get(
    "/marca/:marcaId",
    (req: Request, res: Response, next: NextFunction) => modeloController.getByMarca(req, res, next)
);

export default router;
