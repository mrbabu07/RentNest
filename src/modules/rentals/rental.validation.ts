import { z } from 'zod';

export const createRentalRequestSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  moveInDate: z.coerce.date({
    errorMap: () => ({ message: 'Valid move-in date is required' }),
  }),
  message: z.string().optional(),
});

export const updateRentalStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'], {
    errorMap: () => ({ message: 'Status must be APPROVED or REJECTED' }),
  }),
});

export type CreateRentalRequestInput = z.infer<typeof createRentalRequestSchema>;
export type UpdateRentalStatusInput = z.infer<typeof updateRentalStatusSchema>;