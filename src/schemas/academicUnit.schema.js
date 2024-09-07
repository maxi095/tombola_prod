import { z } from 'zod';

export const createAcademicUnitSchema = z.object({
    name: z.string({
        required_error: 'Name is required'
    }),
    academicUnit: z.string({
        required_error: 'Academic unit ID is required'
    }),
    date: z.string().datetime().optional(),
});
