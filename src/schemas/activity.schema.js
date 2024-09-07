import { z } from 'zod';

export const createActivitySchema = z.object({
    studentId: z.string({
        required_error: 'Student ID is required',
    }),
    activityProjectId: z.string({
        required_error: 'Activity Project ID is required',
    }),
    dateActivity: z.string({
        required_error: 'Date of activity is required',
    }),
});
