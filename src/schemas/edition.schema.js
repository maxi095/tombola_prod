import {z} from 'zod';

export const createEditionSchema = z.object({
    name: z.string({
        required_error: 'Name is required',
    }),

});