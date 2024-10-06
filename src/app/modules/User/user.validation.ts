import { z } from 'zod';
import { USER_Role } from './user.constant';

const userValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    image: z.string()
  }),
});

const updateUserValidationSchema = z.object({
  name: z.string().optional(),
  role: z.nativeEnum(USER_Role).optional(),
});

export const UserValidations = {
  userValidationSchema,
  updateUserValidationSchema,
};
