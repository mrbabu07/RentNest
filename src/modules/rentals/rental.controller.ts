import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as rentalService from './rental.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const createRentalRequest = catchAsync(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user!.userId;
  const request = await rentalService.createRentalRequest(tenantId, req.body);
  res.status(201).json({
    success: true,
    message: 'Rental request submitted successfully',
    data: request,
  });
});

export const getMyRentalRequests = catchAsync(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user!.userId;
  const requests = await rentalService.getTenantRentalRequests(tenantId);
  res.status(200).json({ success: true, data: requests });
});

export const getLandlordRentalRequests = catchAsync(async (req: AuthRequest, res: Response) => {
  const landlordId = req.user!.userId;
  const requests = await rentalService.getLandlordRentalRequests(landlordId);
  res.status(200).json({ success: true, data: requests });
});

export const getRentalRequestById = catchAsync(async (req: AuthRequest, res: Response) => {
  const request = await rentalService.getRentalRequestById(String(req.params.id));
  res.status(200).json({ success: true, data: request });
});

export const updateRentalRequestStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const landlordId = req.user!.userId;
  const { status } = req.body;
  const request = await rentalService.updateRentalRequestStatus(
    String(req.params.id),
    landlordId,
    status
  );
  res.status(200).json({
    success: true,
    message: `Rental request ${status.toLowerCase()} successfully`,
    data: request,
  });
});
