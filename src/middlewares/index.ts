import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { RequestCustom } from '../types/express';

const isAuthenticated = (request: RequestCustom, response: Response, next: NextFunction) => {
  const { authorization } = request.headers;

  if (!authorization) {
    response.status(401);
    throw new Error('🚫 Un-Authorized 🚫');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'secret') as any;
    request.payload = {
      userId: payload.userId,
    };
  } catch (err: any) {
    response.status(401);
    if (err.name === 'TokenExpiredError') {
      throw new Error(err.name);
    }
    throw new Error('🚫 Un-Authorized 🚫');
  }

  return next();
}

export {
  isAuthenticated
}