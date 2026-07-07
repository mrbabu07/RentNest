import { z } from 'zod';
export const createPropertySchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
    location: z.string().min(3, { message: 'Location must be at least 3 characters long' }),
    price: z.number().positive({ message: 'Price must be a positive number' }),
    bedrooms: z.number().int().nonnegative({ message: 'Bedrooms must be a non-negative integer' }),
    bathrooms: z.number().int().nonnegative({ message: 'Bathrooms must be a non-negative integer' }),
    amenities: z.array(z.string()).optional().default([]),
    images: z.array(z.string()).optional().default([]),
    categoryId: z.string().uuid({ message: 'Category ID must be a valid UUID' }),
});

export const updatePropertySchema = createPropertySchema.partial();

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
