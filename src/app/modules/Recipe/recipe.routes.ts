import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { recipeValidationSchema } from './recipe.validation';
import { RecipeControllers } from './recipe.controller';
import { Auth } from '../../middlewares/auth';
import { USER_Role } from '../User/user.constant';

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

router.post('/upvote',Auth(USER_Role.admin, USER_Role.user), RecipeControllers.upVote);
router.post('/downVote',Auth(USER_Role.admin, USER_Role.user), RecipeControllers.downVote);

router.post('/comment/:recipeId', Auth(USER_Role.admin, USER_Role.user),RecipeControllers.commentRecipe);
router.put('/comment/:recipeId/:commentId', Auth(USER_Role.admin, USER_Role.user),RecipeControllers.editCommentRecipe);
router.delete('/comment/:recipeId/:commentId', Auth(USER_Role.admin, USER_Role.user),RecipeControllers.DeleteCommentRecipe);
router.post('/rate/:recipeId',Auth(USER_Role.admin, USER_Role.user), RecipeControllers.rateRecipe);

export const RecipeRoutes = router;
