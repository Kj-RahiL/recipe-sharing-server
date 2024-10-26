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
router.put(
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

router.post('/upvote', RecipeControllers.upVote);
router.post('/downVote', RecipeControllers.downVote);

router.post('/comment/:recipeId',RecipeControllers.commentRecipe);
router.post('/rate/:recipeId', RecipeControllers.rateRecipe);

export const RecipeRoutes = router;
