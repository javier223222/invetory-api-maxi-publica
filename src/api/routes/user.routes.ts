import {Router,Request,Response, NextFunction} from "express";
import { UserController } from "api/controllers";
import { validate } from "api/middlewares";
import { loginSchema } from "api/dtos";

const router:Router=Router();
const userController=new UserController();

router.post(
    "/login",
    validate(loginSchema, 'body'),
    (req:Request,res:Response,next:NextFunction)=>userController.login(req,res,next)
)

router.post(
    "/",
    validate(loginSchema, 'body'),
    (req:Request,res:Response,next:NextFunction)=>userController.create(req,res,next)
)

export default router;