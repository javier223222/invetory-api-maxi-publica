import {Router,Request,Response, NextFunction} from "express";
import { CarController } from "api/controllers";
import { validate } from "api/middlewares";
import { upload } from "api/middlewares";
import { createCarSchema } from "api/dtos";

const router:Router=Router();
const carController=new CarController();
router.post(
    "/",
    upload.single("fotografia"),
    validate(createCarSchema,"body"),
    (req:Request,res:Response,next:NextFunction)=>carController.create(req,res,next)
)
router.get(
    "/:id",
    (req:Request,res:Response,next:NextFunction)=>carController.findById(req,res,next)
)

export default router;
