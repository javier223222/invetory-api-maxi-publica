import {Router,Request,Response, NextFunction} from "express";
import { CarController, } from "api/controllers";
import { validate, authMiddleware } from "api/middlewares";
import { upload } from "api/middlewares";
import { createCarSchema,carFilterSchema,updateCarSchema } from "api/dtos";

const router:Router=Router();
const carController=new CarController();
router.use(authMiddleware);


router.post(
    "/",
    
    upload.single("fotografia"),
    validate(createCarSchema,"body"),
    (req:Request,res:Response,next:NextFunction)=>carController.create(req,res,next)
);

router.post(
    "/:id/fotografia",
    
    upload.single("fotografia"),
    (req:Request,res:Response,next:NextFunction)=>carController.updatePhoto(req,res,next)
)

router.put(
    "/:id",
    
    validate(updateCarSchema,"body"),
    (req:Request,res:Response,next:NextFunction)=>carController.update(req,res,next)
)

router.delete(
    "/:id",
   
    (req:Request,res:Response,next:NextFunction)=>carController.delete(req,res,next)
)

router.get(
    "/:id",
    
    (req:Request,res:Response,next:NextFunction)=>carController.findById(req,res,next)
);


router.get(
    "/",
    
    validate(carFilterSchema,"query"),
    (req:Request,res:Response,next:NextFunction)=>carController.findAll(req,res,next)
);

export default router;
