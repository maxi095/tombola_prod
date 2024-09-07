import {z} from 'zod';

export const createUserSchema = z.object({
    username: z.string({
        required_error: 'Username is required'
    }),
    email: z.string({
        required_error: 'Email is required'
    }),
    password: z.string({
        required_error: 'Password is required'
    }).optional(),
    
    date: z.string().datetime().optional(),
});