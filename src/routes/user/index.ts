import { Router } from "express";
import { UserController } from "../../controllers/user";
import { isAuthenticated } from "../../middlewares";

const userRouter = Router();

userRouter.post("/", UserController.handle);

export { userRouter };
