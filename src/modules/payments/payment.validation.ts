import { z } from 'zod';

export const createPaymentSchema = z.object({
  rentalRequestId: z.string().uuid('Invalid rental request ID'),
  method: z.string().min(2, 'Payment method is required'),
  provider: z.enum(['STRIPE', 'SSLCOMMERZ'], {
    errorMap: () => ({ message: 'Provider must be STRIPE or SSLCOMMERZ' }),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;