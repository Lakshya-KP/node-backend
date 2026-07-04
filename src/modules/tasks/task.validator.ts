import z from "zod"

export const taskParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
})

export const createTaskBodySchema = z.object({
    title: z.coerce.string(),
})

export const taskQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
})


export type TaskParams = z.infer<typeof taskParamsSchema>;
export type createTaskBody = z.infer<typeof createTaskBodySchema>;
export type TaskQuery = z.infer<typeof taskQuerySchema>;