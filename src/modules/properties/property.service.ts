import prisma from '../../config/db';
import { CreatePropertyInput, UpdatePropertyInput } from './property.validation';

interface PropertyFilters {
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  bedrooms?: string;
}

export const createProperty = async (landlordId: string, data: CreatePropertyInput) => {
  // Check category exists
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) {
    const error: any = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.property.create({
    data: {
      ...data,
      landlordId,
    },
  });
};

export const getAllProperties = async (filters: PropertyFilters) => {
  const where: any = { status: 'AVAILABLE' };

  if (filters.location) {
    where.location = { contains: filters.location, mode: 'insensitive' };
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.bedrooms) {
    where.bedrooms = Number(filters.bedrooms);
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = Number(filters.minPrice);
    if (filters.maxPrice) where.price.lte = Number(filters.maxPrice);
  }

  return prisma.property.findMany({
    where,
    include: {
      category: true,
      landlord: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: { select: { id: true, name: true, phone: true, email: true } },
      reviews: {
        include: { tenant: { select: { id: true, name: true } } },
      },
    },
  });

  if (!property) {
    const error: any = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  return property;
};

export const updateProperty = async (
  propertyId: string,
  landlordId: string,
  data: UpdatePropertyInput
) => {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });

  if (!property) {
    const error: any = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  if (property.landlordId !== landlordId) {
    const error: any = new Error('You are not authorized to update this property');
    error.statusCode = 403;
    throw error;
  }

  return prisma.property.update({
    where: { id: propertyId },
    data,
  });
};

export const deleteProperty = async (propertyId: string, landlordId: string) => {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });

  if (!property) {
    const error: any = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  if (property.landlordId !== landlordId) {
    const error: any = new Error('You are not authorized to delete this property');
    error.statusCode = 403;
    throw error;
  }

  return prisma.property.delete({ where: { id: propertyId } });
};

export const getLandlordProperties = async (landlordId: string) => {
  return prisma.property.findMany({
    where: { landlordId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
};