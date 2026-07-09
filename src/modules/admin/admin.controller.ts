import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as adminService from './admin.service';

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await adminService.getAllUsers();
  res.status(200).json({ success: true, data: users });
});

export const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const user = await adminService.updateUserStatus(String(req.params.id), status);
  res.status(200).json({
    success: true,
    message: `User ${status === 'BANNED' ? 'banned' : 'unbanned'} successfully`,
    data: user,
  });
});

export const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const properties = await adminService.getAllPropertiesAdmin();
  res.status(200).json({ success: true, data: properties });
});

export const getAllRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const requests = await adminService.getAllRentalRequestsAdmin();
  res.status(200).json({ success: true, data: requests });
});

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await adminService.getDashboardStats();
  res.status(200).json({ success: true, data: stats });
});
