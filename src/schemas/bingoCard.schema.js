import { z } from 'zod';

export const createBingoCardSchema = z.object({
    edition: z.string({
        required_error: 'Edition ID is required'
    }).min(1, 'Edition ID cannot be empty'),

    number: z.number({
        required_error: 'Card number is required'
    }).int().min(1, 'Card number must be at least 1'),

    status: z.enum(['Disponible', 'Vendido'], {
        required_error: 'Status is required'
    }),

    user: z.string({
        required_error: 'User ID is required'
    }).min(1, 'User ID cannot be empty'),
});
