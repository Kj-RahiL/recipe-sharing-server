import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RecipeServices } from './recipe.service';

const createRecipe = catchAsync(async (req, res) => {
    console.log(req.body)
  const result = await RecipeServices.createRecipeIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recipe created successfully',
    data: result,
  });
});

const getAllRecipe = catchAsync(async (req, res) => {
  const result = await RecipeServices.getAllRecipeFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recipe retrieved successfully!',
    data: result,
  });
});
const getSingleRecipe = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id, 'i hiittniing')
  const result = await RecipeServices.getRecipeFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recipe retrieved successfully!',
    data: result,
  });
});
const updateRecipe = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RecipeServices.updateRecipe(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recipe updated successfully!',
    data: result,
  });
});
const deleteRecipe = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RecipeServices.deleteRecipe(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Recipe deleted successfully',
      data: result,
    });
  })

  const upVote = catchAsync(async (req, res) => {
    const { userId, followId } = req.body; 
    const result = await RecipeServices.upVoteRecipeIntoDB(userId, followId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'UpVoting Recipe',
      data: result,
    });
  });
  
  const downVote = catchAsync(async (req, res) => {
    const { userId, followId } = req.body;
  
    const result = await RecipeServices.downVoteRecipeIntoDB(userId, followId)
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'DownVoting Recipe',
      data: result,
    });
  });
  const commentRecipe = catchAsync(async (req, res) => {
    const { id } = req.params;
    const {user, comment } = req.body;

    console.log(req.body)
    const result = await RecipeServices.commentOnRecipeIntoDb(user, id, followId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Successfully Comment on Recipe',
      data: result,
    });
  });
  
  const rateRecipe = catchAsync(async (req, res) => {
    const {recipeId} = req.params
    const { userId, rating } = req.body;
  
    const result = await RecipeServices.rateRecipeIntoDB(userId, recipeId, rating)
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Rating Recipe',
      data: result,
    });
  });

export const RecipeControllers = {
  createRecipe,
  getAllRecipe,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
  upVote,
  downVote,
  commentRecipe,
  rateRecipe
};
