import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;