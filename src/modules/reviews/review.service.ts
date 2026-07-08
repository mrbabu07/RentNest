import prisma from '../../config/db';
import { CreateReviewInput } from './review.validation';

export const createReview = async (tenantId: string, data: CreateReviewInput) => {
  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
  });

  if (!property) {
    const error: any = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  const rentalHistory = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: data.propertyId,
      status: { in: ['ACTIVE', 'COMPLETED'] },
    },
  });

  if (!rentalHistory) {
    const error: any = new Error('You can only review properties you have rented');
    error.statusCode = 403;
    throw error;
  }

  const existingReview = await prisma.review.findFirst({
    where: { tenantId, propertyId: data.propertyId },
  });

  if (existingReview) {
    const error: any = new Error('You have already reviewed this property');
    error.statusCode = 409;
    throw error;
  }

  return prisma.review.create({
    data: {
      tenantId,
      propertyId: data.propertyId,
      rating: data.rating,
      comment: data.comment,
    },
    include: { tenant: { select: { id: true, name: true } } },
  });
};

export const getPropertyReviews = async (propertyId: string) => {
  return prisma.review.findMany({
    where: { propertyId },
    include: { tenant: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteReview = async (reviewId: string, tenantId: string) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review) {
    const error: any = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  if (review.tenantId !== tenantId) {
    const error: any = new Error('You are not authorized to delete this review');
    error.statusCode = 403;
    throw error;
  }

  return prisma.review.delete({ where: { id: reviewId } });
};