import { Router } from 'express';
import { Auth } from '../../middlewares/auth';
import { USER_Role } from '../User/user.constant';
import { OrderController } from './order.controller';

const router = Router();

router.post('/', Auth(USER_Role.user), OrderController.createOrder);

export const orderRoutes = router;
