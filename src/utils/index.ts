import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export class Utils {
  static hashToken(token: string) {
    return crypto.createHash('sha512').update(token).digest('hex');
  }

  static generateAccessToken(user: any) {
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '5m' });
  }

  static generateRefreshToken(user: any, jti: string) {
    return jwt.sign({ userId: user.id, jti }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '8h' });
  }

  static generateTokens(user: any, jti: string) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user, jti);

    return {
      accessToken,
      refreshToken,
    };
  }
}