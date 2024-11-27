import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentServices } from './comment.service';

const createComment = catchAsync(async (req, res) => {
  const result = await CommentServices.createCommentIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comment created successfully',
    data: result,
  });
});

const getAllCommentByRecipe = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const result = await CommentServices.getAllCommentByRecipe(recipeId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comment retrieved successfully By Recipe!',
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { recipeId,commentId } = req.params;
  console.log('api hit', recipeId,commentId, req.body)
  const result = await CommentServices.updateCommentIntoDB(recipeId,commentId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comment updated successfully!',
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { recipeId,commentId } = req.params;
  const result = await CommentServices.deleteCommentIntoDB(recipeId,commentId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comment Deleted successfully!',
    data: result,
  });
});

export const commentControllers = {
  createComment, getAllCommentByRecipe, updateComment, deleteComment
};
