import { Router, Request, Response, NextFunction } from "express";
import { YearController } from "api/controllers";
import { authMiddleware } from "@api/middlewares/auth.middleware";

const router: Router = Router();
const yearController = new YearController();
router.use(authMiddleware);
router.get(
    "/",
    (req: Request, res: Response, next: NextFunction) => yearController.getAvailableYears(req, res, next)
);

export default router;
