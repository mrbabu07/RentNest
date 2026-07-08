import prisma from '../../config/db';
import { CreateRentalRequestInput } from './rental.validation';

export const createRentalRequest = async (tenantId: string, data: CreateRentalRequestInput) => {
  // Check property exists and is available
  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
  });

  if (!property) {
    const error: any = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  if (property.status !== 'AVAILABLE') {
    const error: any = new Error('This property is not available for rent');
    error.statusCode = 400;
    throw error;
  }

  // Prevent landlord from requesting their own property
  if (property.landlordId === tenantId) {
    const error: any = new Error('You cannot request your own property');
    error.statusCode = 400;
    throw error;
  }

  // Prevent duplicate pending requests for same property by same tenant
  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: data.propertyId,
      status: 'PENDING',
    },
  });

  if (existingRequest) {
    const error: any = new Error('You already have a pending request for this property');
    error.statusCode = 409;
    throw error;
  }

  return prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: data.propertyId,
      moveInDate: data.moveInDate,
      message: data.message,
    },
    include: { property: true },
  });
};

// Tenant's own rental requests
export const getTenantRentalRequests = async (tenantId: string) => {
  return prisma.rentalRequest.findMany({
    where: { tenantId },
    include: {
      property: { include: { category: true } },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

// Landlord: all requests for their properties
export const getLandlordRentalRequests = async (landlordId: string) => {
  return prisma.rentalRequest.findMany({
    where: {
      property: { landlordId },
    },
    include: {
      property: true,
      tenant: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getRentalRequestById = async (id: string) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      property: true,
      tenant: { select: { id: true, name: true, email: true, phone: true } },
      payment: true,
    },
  });

  if (!request) {
    const error: any = new Error('Rental request not found');
    error.statusCode = 404;
    throw error;
  }

  return request;
};

// Landlord approves or rejects
export const updateRentalRequestStatus = async (
  requestId: string,
  landlordId: string,
  status: 'APPROVED' | 'REJECTED'
) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id: requestId },
    include: { property: true },
  });

  if (!request) {
    const error: any = new Error('Rental request not found');
    error.statusCode = 404;
    throw error;
  }

  if (request.property.landlordId !== landlordId) {
    const error: any = new Error('You are not authorized to update this request');
    error.statusCode = 403;
    throw error;
  }

  if (request.status !== 'PENDING') {
    const error: any = new Error(`This request has already been ${request.status.toLowerCase()}`);
    error.statusCode = 400;
    throw error;
  }

  const updatedRequest = await prisma.rentalRequest.update({
    where: { id: requestId },
    data: { status },
  });

  // If approved, mark property as RENTED so no one else can request it
  if (status === 'APPROVED') {
    await prisma.property.update({
      where: { id: request.propertyId },
      data: { status: 'RENTED' },
    });
  }

  return updatedRequest;
};