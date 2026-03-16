import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from '../utils/jwt';
import { AppError } from '../middleware/error.middleware';
import { RegisterBody, LoginBody } from '../types';

export async function register(
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, name } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('Email already in use', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user, accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }

    // Verify JWT
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    // Check it exists in DB and isn't expired
    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new AppError('Refresh token expired or revoked', 401);
    }

    // Rotate: delete old, issue new
    await prisma.refreshToken.delete({ where: { id: stored.id } });

    const newAccessToken = generateAccessToken({ userId: payload.userId, email: payload.email });
    const newRefreshToken = generateRefreshToken({ userId: payload.userId, email: payload.email });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: payload.userId,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    res.json({
      success: true,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}