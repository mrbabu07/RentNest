// import { Response } from 'express';
// import catchAsync from '../../utils/catchAsync';
// import * as paymentService from './payment.service';
// import { AuthRequest } from '../../middlewares/auth.middleware';

// export const createPayment = catchAsync(async (req: AuthRequest, res: Response) => {
//   const tenantId = req.user!.userId;
//   const payment = await paymentService.createPayment(tenantId, req.body);
//   res.status(201).json({
//     success: true,
//     message: 'Payment completed successfully',
//     data: payment,
//   });
// });

// export const getMyPayments = catchAsync(async (req: AuthRequest, res: Response) => {
//   const tenantId = req.user!.userId;
//   const payments = await paymentService.getTenantPayments(tenantId);
//   res.status(200).json({ success: true, data: payments });
// });

// export const getPaymentById = catchAsync(async (req: AuthRequest, res: Response) => {
//   const userId = req.user!.userId;
//   const payment = await paymentService.getPaymentById(req.params.id, userId);
//   res.status(200).json({ success: true, data: payment });
// });


import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as paymentService from './payment.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const createPaymentIntent = catchAsync(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user!.userId;
  const result = await paymentService.createPaymentIntent(tenantId, req.body);
  res.status(201).json({
    success: true,
    message: 'Payment intent created successfully',
    data: result,
  });
});

export const confirmPayment = catchAsync(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user!.userId;
  const payment = await paymentService.confirmPayment(tenantId, req.body);
  res.status(200).json({
    success: true,
    message: 'Payment confirmed successfully',
    data: payment,
  });
});

export const getMyPayments = catchAsync(async (req: AuthRequest, res: Response) => {
  const tenantId = req.user!.userId;
  const payments = await paymentService.getTenantPayments(tenantId);
  res.status(200).json({ success: true, data: payments });
});

export const getPaymentById = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const payment = await paymentService.getPaymentById(String(req.params.id), userId);
  res.status(200).json({ success: true, data: payment });
});
