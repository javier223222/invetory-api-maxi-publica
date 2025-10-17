import { Router, Request, Response, NextFunction } from "express";
import { MarcaController } from "api/controllers";
import { authMiddleware } from "@api/middlewares";

const router: Router = Router();
const marcaController = new MarcaController();

router.use(authMiddleware);
router.get(

    "/",

    (req: Request, res: Response, next: NextFunction) => marcaController.getAll(req, res, next)
);

export default router;
