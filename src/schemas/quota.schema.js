import { z } from 'zod';

export const createQuotaSchema = z.object({
    bingoCard: z.string({
        required_error: 'Bingo Card ID is required'
    }).min(1, 'Bingo Card ID cannot be empty'),

    quotaNumber: z.number({
        required_error: 'Quota number is required'
    }).int().min(1, 'Quota number must be at least 1'),

    dueDate: z.string({
        required_error: 'Due date is required'
    }).refine(date => !isNaN(Date.parse(date)), {
        message: 'Invalid date format'
    }),

    amount: z.number({
        required_error: 'Amount is required'
    }).min(0, 'Amount must be greater than or equal to 0'),

    paymentDate: z.string().optional().nullable().refine(date => 
        !date || !isNaN(Date.parse(date)), 
        { message: 'Invalid date format' }
    ),

    paymentMethod: z.enum(['Efectivo', 'Tarjeta', 'Transferencia', 'Otro'], {
        required_error: 'Payment method is required'
    }).optional()
});
