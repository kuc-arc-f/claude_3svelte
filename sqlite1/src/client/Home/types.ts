import { z } from 'zod';

export const TodoSchema = z.object({
  title: z.string().min(1, { message: "タイトルは必須です" }),
  description: z.string().optional(),
});

export type Todo = z.infer<typeof TodoSchema> & {
  id: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};