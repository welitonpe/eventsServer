import { Router, Request, Response } from "express";

import { authRouter } from "./auth";
import { userRouter } from "./user";

const router = Router();

router.post('/health', (request: Request, response: Response) => {
  return response.json({ ok: true });
});

router.use("/auth", authRouter);
router.use('/users', userRouter);

export { router };