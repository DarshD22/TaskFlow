import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../types';

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired access token',
    });
  }
}