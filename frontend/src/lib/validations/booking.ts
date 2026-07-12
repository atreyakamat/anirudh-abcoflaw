import { z } from 'zod';

export const bookingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  practiceArea: z.string().min(1, 'Practice area is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export type BookingInput = z.infer<typeof bookingSchema>;