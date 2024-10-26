import { z } from 'zod';
import { USER_Role, USER_Status } from './user.constant';

const userValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    image: z.string(),
  }),
});

const updateUserValidationSchema = z.object({
  name: z.string().optional(),
  role: z.nativeEnum(USER_Role).optional(),
  status: z.nativeEnum(USER_Status).optional(),
  bio: z.string().optional(),
});

export const UserValidations = {
  userValidationSchema,
  updateUserValidationSchema,
};
