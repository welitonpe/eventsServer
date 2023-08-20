import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../services/auth';
import { UserService } from "../../services/user";
import { Utils } from '../../utils';

class UserController {
  static async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password, name, familyName } = request.body;

      if (!email || !password || !name || !familyName) {
        response.status(400);
        throw new Error('You must provide user data.');
      }

      const existingUser = await UserService.findByEmail(email);

      if (existingUser) {
        response.status(400);
        throw new Error('Email already in use.');
      }

      const user = await UserService.create({ email, password, name, familyName });
      const jti = uuidv4();
      const { accessToken, refreshToken } = Utils.generateTokens(user, jti);
      await AuthService.addRefreshToken({ jti, refreshToken, userId: user.id });

      response.json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }
}

export { UserController };

