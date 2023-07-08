import { Router, Request, Response } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { LoginController } from "./controllers/login/LoginController";

const router = Router();

router.post("/login", (request, response) => {
  const login = new LoginController().handle(request, response);

  return response.send(login);
});

router.get("/test", (request: Request, response: Response) =>
  response.json({ ok: true })
);

router.post("/user", (request, response) => {
  const createResponse = new CreateUserController().handle(request, response);
  return response.send(createResponse);
});

router.post("/user/create", async (request: Request, response: Response) => {
  console.log(request);

  return response.json({ ok: true });
});

export { router };
