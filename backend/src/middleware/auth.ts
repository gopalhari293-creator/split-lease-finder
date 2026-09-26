import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, COOKIE_OPTIONS } from '../config/constants.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: 'USER' | 'ADMIN';
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const tokenFromCookie = req.cookies?.token;
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: 'USER' | 'ADMIN' };
    req.user = decoded;
    next();
  } catch (error) {
    // Clear dead/invalid cookie so subsequent browser requests don't repeatedly send a bad cookie
    res.clearCookie('token', COOKIE_OPTIONS);
    res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
    return;
  }
};

export const optionalAuthenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const tokenFromCookie = req.cookies?.token;
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const token = tokenFromCookie || tokenFromHeader;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: 'USER' | 'ADMIN' };
      req.user = decoded;
    } catch (error) {
      // Clear dead cookie if expired/invalid without throwing 401 on public routes
      res.clearCookie('token', COOKIE_OPTIONS);
      req.user = undefined;
    }
  }
  next();
};

export const requireRole = (...allowedRoles: Array<'USER' | 'ADMIN'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthenticated user.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden. Access restricted to authorized roles.' });
      return;
    }

    next();
  };
};
