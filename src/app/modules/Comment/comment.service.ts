import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { Comment } from './comment.model';
import { TComment } from './comment.interface';
import { Recipe } from '../Recipe/recipe.model';

const createCommentIntoDB = async (payload: TComment) => {
  const recipe = await Recipe.findById(payload.recipe);

  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  // Create a new comment
  const comment = await Comment.create(payload);
  return comment;
};

const getAllCommentByRecipe = async (recipeId: string) => {};

const updateCommentIntoDB = async (
  recipeId: string,
  commentId: string,
  payload: TComment,
) => {};
const deleteCommentIntoDB = async (recipeId: string, commentId: string) => {};

export const CommentServices = {
  createCommentIntoDB,
  getAllCommentByRecipe,
  updateCommentIntoDB,
  deleteCommentIntoDB,
};
