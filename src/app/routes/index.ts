import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { RecipeRoutes } from '../modules/Recipe/recipe.routes';
import { orderRoutes } from '../modules/order/order.routes';
import { paymentRoutes } from '../modules/payment/payment.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/recipe',
    route: RecipeRoutes,
  },
  {
    path: '/order',
    route: orderRoutes,
  },
  {
    path: '/payConfirm',
    route: paymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
