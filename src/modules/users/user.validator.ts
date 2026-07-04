import z from "zod";

export const userParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
})

export type UserParams = z.infer<typeof userParamsSchema>;