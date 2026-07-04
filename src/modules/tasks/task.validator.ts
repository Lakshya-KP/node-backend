import z from "zod"

export const taskParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
})

export const createTaskBodySchema = z.object({
    title: z.coerce.string(),
})

export const taskQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    completed: z.coerce.boolean().optional(),
    search: z.string().trim().optional(),
    sort: z.enum(['createdAt', 'updatedAt', 'title', 'completed']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
})


export type TaskParams = z.infer<typeof taskParamsSchema>;
export type createTaskBody = z.infer<typeof createTaskBodySchema>;
export type TaskQuery = z.infer<typeof taskQuerySchema>;