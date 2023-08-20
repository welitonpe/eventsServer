import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../services/auth';
import { UserService } from "../../services/user";
import { Utils } from '../../utils';
import { RequestCustom } from "../../types/express";
import bcrypt from 'bcrypt';

class AuthController {
  static async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body;
      if (!email || !password) {
        response.status(400);
        throw new Error('You must provide an email and a password.');
      }

      const existingUser = await UserService.findByEmail(email);

      if (!existingUser) {
        response.status(403);
        throw new Error('Invalid login credentials.');
      }

      const validPassword = await bcrypt.compare(password, existingUser.password);
      if (!validPassword) {
        response.status(403);
        throw new Error('Invalid login credentials.');
      }

      const jti = uuidv4();
      const { accessToken, refreshToken } = Utils.generateTokens(existingUser, jti);
      await AuthService.addRefreshToken({ jti, refreshToken, userId: existingUser.id });

      response.json({
        accessToken,
        refreshToken
      });
    } catch (err) {
      next(err);
    }
  }

  static async revoke(request: Request, response: Response, next: NextFunction) {
    try {
      const { userId } = request.body;
      await AuthService.revokeTokensByUserId(userId);
      response.json({ message: `Tokens revoked for user with id #${userId}` });
    } catch (err) {
      next(err);
    }
  }

  static async refresh(request: Request, response: Response, next: NextFunction) {
    try {
      const { refreshToken } = request.body;
      if (!refreshToken) {
        response.status(400);
        throw new Error('Missing refresh token.');
      }
      const payload = jwt.verify(refreshToken, process.env.JWT_SECRET ?? 'secret') as any;
      const savedRefreshToken = await AuthService.findRefreshTokenById(payload.jti);

      if (!savedRefreshToken || savedRefreshToken.revoked === true) {
        response.status(401);
        throw new Error('Unauthorized');
      }

      const hashedToken = Utils.hashToken(refreshToken);
      if (hashedToken !== savedRefreshToken.hashedToken) {
        response.status(401);
        throw new Error('Unauthorized');
      }

      const user = await UserService.findUserById(payload.userId);
      if (!user) {
        response.status(401);
        throw new Error('Unauthorized');
      }

      await AuthService.deleteRefreshTokenById(savedRefreshToken.id);
      const jti = uuidv4();
      const { accessToken, refreshToken: newRefreshToken } = Utils.generateTokens(user, jti);
      await AuthService.addRefreshToken({ jti, refreshToken: newRefreshToken, userId: user.id });

      response.json({
        accessToken,
        refreshToken: newRefreshToken
      });
    } catch (err) {
      next(err);
    }
  }

  static async profile(request: RequestCustom, response: Response, next: NextFunction) {
    try {
      const userId = request.payload?.userId;
      const user = await UserService.findUserById(userId!);
      response.json(user);
    } catch (err) {
      next(err);
    }
  }
}

export { AuthController };
