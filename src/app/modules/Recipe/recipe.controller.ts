import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RecipeServices } from './recipe.service';

const createRecipe = catchAsync(async (req, res) => {
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

export const RecipeControllers = {
  createRecipe,
  getAllRecipe,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe
};
