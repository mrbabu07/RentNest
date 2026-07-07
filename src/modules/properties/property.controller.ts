import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as propertyService from './property.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const createProperty = catchAsync(async (req: AuthRequest, res: Response) => {
  const landlordId = req.user!.userId;
  const property = await propertyService.createProperty(landlordId, req.body);
  res.status(201).json({
    success: true,
    message: 'Property created successfully',
    data: property,
  });
});

export const getAllProperties = catchAsync(async (req: AuthRequest, res: Response) => {
  const properties = await propertyService.getAllProperties(req.query);
  res.status(200).json({
    success: true,
    data: properties,
  });
});

export const getPropertyById = catchAsync(async (req: AuthRequest, res: Response) => {
  const property = await propertyService.getPropertyById(req.params.id);
  res.status(200).json({
    success: true,
    data: property,
  });
});

export const updateProperty = catchAsync(async (req: AuthRequest, res: Response) => {
  const landlordId = req.user!.userId;
  const property = await propertyService.updateProperty(req.params.id, landlordId, req.body);
  res.status(200).json({
    success: true,
    message: 'Property updated successfully',
    data: property,
  });
});

export const deleteProperty = catchAsync(async (req: AuthRequest, res: Response) => {
  const landlordId = req.user!.userId;
  await propertyService.deleteProperty(req.params.id, landlordId);
  res.status(200).json({
    success: true,
    message: 'Property deleted successfully',
  });
});

export const getMyProperties = catchAsync(async (req: AuthRequest, res: Response) => {
  const landlordId = req.user!.userId;
  const properties = await propertyService.getLandlordProperties(landlordId);
  res.status(200).json({
    success: true,
    data: properties,
  });
});