import { z } from 'zod';

export const createActivityProjectSchema = z.object({
    name: z.string({
        required_error: 'Name is required',
    }),
    description: z.string().optional(),
    project: z.string({
        required_error: 'Project is required',
    }),
    hours: z.number({
        required_error: 'Hours are required',
    }).int().positive(), // Asegúrate de que las horas sean un entero positivo
});

export const updateActivityProjectSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    project: z.string().optional(),
    hours: z.number().int().positive().optional(),
});
