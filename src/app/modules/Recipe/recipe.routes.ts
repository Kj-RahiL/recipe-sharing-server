import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { recipeValidationSchema } from './recipe.validation';
import { RecipeControllers } from './recipe.controller';

const router = express.Router();

// only for admin create
router.post(
  '/',
  validateRequest(recipeValidationSchema),
  RecipeControllers.createRecipe
);

router.get('/:id', RecipeControllers.getSingleRecipe);

// only for admin update and delete
router.patch(
  '/:id',
//   validateRequest(updateFacilityValidationSchema),
//   Auth(USER_Role.admin),
RecipeControllers.updateRecipe
);
router.delete(
  '/:id',
//   Auth(USER_Role.admin),
RecipeControllers.deleteRecipe,
);
router.get('/', RecipeControllers.getAllRecipe);

export const RecipeRoutes = router;
