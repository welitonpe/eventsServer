import { LoginRequest } from "../../models/interfaces/login/LoginRequest";
import { LoginService } from "../../services/login/LoginService";
import { Request, Response } from "express";

class LoginController {
  async handle(request: Request, response: Response) {
    const { email, password }: any = request.body;

    const loginService = new LoginService();

    const login = await loginService.execute({
      email,
      password,
    });

    return response.json(login);
  }
}

export { LoginController };
