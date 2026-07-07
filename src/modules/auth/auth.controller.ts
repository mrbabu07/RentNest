import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as authService from './auth.service';

export const register = catchAsync(async (req: Request, res: Response)=>{
    const result = await authService.registerUser(req.body);
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
    });
});
    
export const login = catchAsync(async (req: Request, res: Response)=>{
    const result = await authService.loginUser(req.body);
    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: result
    });
});

export const getMe = catchAsync(async (req: Request, res: Response)=>{
    const userId = (req as any).userId;
    const user = await authService.getCurrentUser(userId);
    res.status(200).json({
        success: true,
        message: 'User fetched successfully',
        data: user
    });
});