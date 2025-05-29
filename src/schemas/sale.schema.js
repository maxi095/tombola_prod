import { z } from 'zod';

export const createSaleSchema = z.object({
    edition: z.string({
        required_error: 'Edition ID is required'
    }).min(1, 'Edition ID cannot be empty'),
    
    seller: z.string({
        required_error: 'Seller ID is required'
    }).min(1, 'Seller ID cannot be empty'),
    
    client: z.string({
        required_error: 'Client ID is required'
    }).min(1, 'Client ID cannot be empty'),
    
    bingoCard: z.string({
        required_error: 'BingoCard ID is required'
    }).min(1, 'BingoCard ID cannot be empty'),


    status: z.enum(['Pendiente de pago', 'Pagado', 'Cancelado'], {
        required_error: 'Status is required'
    }),

    user: z.string({
        required_error: 'User ID is required'
    }).min(1, 'User ID cannot be empty'),
});
