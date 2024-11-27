import { z } from 'zod';
const commentValidationSchema = z.object({
  body: z.object({
    user: z.string().min(1, 'User ID is required.'),
    recipe: z.string().min(1, 'User ID is required.'),
    comment: z.string().min(1, 'Comment cannot be empty.'),
    date: z.date().default(new Date()),
  }),
});

const updateCommentValidationSchema = z.object({
  comment: z.string().min(1, 'Comment cannot be empty.'),
  date: z.date().default(new Date())
});

export const CommentValidations = {
  commentValidationSchema,
  updateCommentValidationSchema,
};
