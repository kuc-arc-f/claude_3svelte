import { z } from 'zod';

export const todoSchema = z.object({
    title: z.string().min(1, { message: 'タイトルは必須です' }),
    content: z.string().min(1, { message: '内容は必須です' }),
    public: z.number(),
    food_orange: z.number(),
    food_apple: z.number(),
    food_banana: z.number(),
    pub_date: z.string(),
    qty1: z.string(),
    qty2: z.string(),
    qty3: z.string()
});