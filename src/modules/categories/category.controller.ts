import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as categoryService from './category.service';

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

export const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(String(req.params.id));
  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});
