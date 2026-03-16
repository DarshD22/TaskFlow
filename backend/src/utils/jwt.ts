import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

export function generateAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY } as jwt.SignOptions);
}

export function generateRefreshToken(payload: AuthPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AuthPayload {
  return jwt.verify(token, ACCESS_SECRET) as AuthPayload;
}

export function verifyRefreshToken(token: string): AuthPayload {
  return jwt.verify(token, REFRESH_SECRET) as AuthPayload;
}

export function getRefreshTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // 7 days
  return expiry;
}