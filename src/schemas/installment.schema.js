import { z } from 'zod';

export const createInstallmentSchema = z.object({
    sale: z.string({
        required_error: 'Sale ID is required'
    }).min(1, 'Sale ID cannot be empty'),

    installmentNumber: z.number({
        required_error: 'Installment number is required'
    }).int().min(1, 'Installment number must be at least 1'),

    dueDate: z.string({
        required_error: 'Due date is required'
    }).refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format'
    }),

    amount: z.number({
        required_error: 'Amount is required'
    }).positive('Amount must be greater than 0'),

    paymentDate: z.string().optional().nullable().refine((date) => !date || !isNaN(Date.parse(date)), {
        message: 'Invalid date format'
    }),

    paymentMethod: z.enum(['Efectivo', 'Tarjeta Crédito', 'Tarjeta Débito', 'Transferencia', 'Otros']).optional(),

    status: z.enum(['Pendiente', 'Pagado', 'Vencido'], {
        required_error: 'Status is required'
    }),

    user: z.string({
        required_error: 'User ID is required'
    }).min(1, 'User ID cannot be empty'),
});
