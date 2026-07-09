// import { z } from 'zod';

// export const createPaymentSchema = z.object({
//   rentalRequestId: z.string().uuid('Invalid rental request ID'),
//   method: z.string().min(2, 'Payment method is required'),
//   provider: z.enum(['STRIPE', 'SSLCOMMERZ'], {
//     errorMap: () => ({ message: 'Provider must be STRIPE or SSLCOMMERZ' }),
//   }),
// });

// export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;


import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  rentalRequestId: z.string().uuid('Invalid rental request ID'),
});

export const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
  paymentMethodId: z.string().optional(), // defaults to Stripe test card
});

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;