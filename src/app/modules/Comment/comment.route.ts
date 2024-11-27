import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CommentValidations } from './comment.validation';

const router = express.Router();

router.post(
  '/create-comment',
  validateRequest(CommentValidations.commentValidationSchema),
 
);

//get recipeId by all comment
router.get('/:recipeId',);

//update comment
router.put(
  '/:recipeId/:commentId',
  validateRequest(CommentValidations.updateCommentValidationSchema),
  
);
//delete comment
router.delete(
  '/:recipeId/:commentId',

);

export const UserRoutes = router;
