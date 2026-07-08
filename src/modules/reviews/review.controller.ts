import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as reviewService from './review.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const createReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user!.userId;
  const review = await reviewService.createReview(tenantId, req.body);
  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: review,
  });
});

export const getPropertyReviews = catchAsync(async (req: Request, res: Response) => {
  const reviews = await reviewService.getPropertyReviews(req.params.propertyId);
  res.status(200).json({ success: true, data: reviews });
});

export const deleteReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user!.userId;
  await reviewService.deleteReview(req.params.id, tenantId);
  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});