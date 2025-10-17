import {Router,Request,Response, NextFunction} from "express";
import { CarController, } from "api/controllers";
import { validate, authMiddleware } from "api/middlewares";
import { upload } from "api/middlewares";
import { createCarSchema,carFilterSchema,updateCarSchema } from "api/dtos";

const router:Router=Router();
const carController=new CarController();


router.post(
    "/",
    authMiddleware,
    upload.single("fotografia"),
    validate(createCarSchema,"body"),
    (req:Request,res:Response,next:NextFunction)=>carController.create(req,res,next)
);

router.post(
    "/:id/fotografia",
    authMiddleware,
    upload.single("fotografia"),
    (req:Request,res:Response,next:NextFunction)=>carController.updatePhoto(req,res,next)
)

router.put(
    "/:id",
    authMiddleware,
    validate(updateCarSchema,"body"),
    (req:Request,res:Response,next:NextFunction)=>carController.update(req,res,next)
)

router.delete(
    "/:id",
    authMiddleware,
    (req:Request,res:Response,next:NextFunction)=>carController.delete(req,res,next)
)

router.get(
    "/:id",
    authMiddleware,
    (req:Request,res:Response,next:NextFunction)=>carController.findById(req,res,next)
);


router.get(
    "/",
    authMiddleware,
    validate(carFilterSchema,"query"),
    (req:Request,res:Response,next:NextFunction)=>carController.findAll(req,res,next)
);

export default router;
