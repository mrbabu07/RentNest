import { z } from 'zod';

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'BANNED'], {
    errorMap: () => ({ message: 'Status must be ACTIVE or BANNED' }),
  }),
});

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;