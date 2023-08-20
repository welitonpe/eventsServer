import prismaClient from '../../prisma';
import { Utils } from '../../utils';

export interface RefreshToken {
  jti: string;
  refreshToken: string;
  userId: string;
}

export class AuthService {
  static addRefreshToken({ jti, refreshToken, userId }: RefreshToken) {
    return prismaClient.refreshToken.create({
      data: {
        id: jti,
        hashedToken: Utils.hashToken(refreshToken),
        userId,
      },
    });
  }

  static findRefreshTokenById(id: string) {
    return prismaClient.refreshToken.findUnique({ where: { id } });
  }

  static deleteRefreshTokenById(id: string) {
    return prismaClient.refreshToken.delete({ where: { id }, select: { revoked: true } });
  }

  static revokeTokensByUserId(userId: string) {
    return prismaClient.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
}