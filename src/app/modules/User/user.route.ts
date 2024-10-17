import express from 'express';
import { UserValidations } from './user.validation';
import { userControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-admin',
  validateRequest(UserValidations.userValidationSchema),
  userControllers.createAdmin,
);

//get
router.get('/:id', userControllers.getUser);

//update
router.patch(
  '/:id',
  validateRequest(UserValidations.updateUserValidationSchema),
  userControllers.updateUser,
);

router.post('/follow', userControllers.followUser);
router.post('/unFollow', userControllers.unFollowUser);

//getAll
router.get('/', userControllers.getAllUser);

export const UserRoutes = router;
