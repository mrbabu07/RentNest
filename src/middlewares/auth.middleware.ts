import {Request, Response, NextFunction} from 'express';
import { verifyToken } from '../utils/jwt.utils';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided, access denied',

    });
  }
  const token = authHeader.split(' ')[1];

  try { 
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

//Role-based access control 
export const authorize = (...allowedRoles: string[])=>{
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if(!req.user || !allowedRoles.includes(req.user.role)){
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};
  