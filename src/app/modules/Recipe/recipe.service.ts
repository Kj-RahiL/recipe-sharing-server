import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { TComment, TRecipe } from "./recipe.interface";
import { Recipe } from "./recipe.model";
import { Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

const createRecipeIntoDB = async (payload: TRecipe) => {
  const recipe = await Recipe.create(payload);
  return recipe;
};

const getAllRecipeFromDB = async (query: Record<string, unknown>) => {
  const queryObj = { ...query };
  let searchTerm = '';
  const searchableFields = ['title', 'category', 'tags', 'cookingTime'];

  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const searchQuery = Recipe.find({
    $or: searchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  }).populate('author');

  // Filter
  const excludeFields = ['searchTerm', 'sort', 'limit', 'page'];
  excludeFields.forEach((el) => delete queryObj[el]);
  
  const filterQuery = searchQuery.find(queryObj);

  // Sorting
  let sortBy: any = { upVotes: -1 }// Default to latest
  if (query?.sort === 'rating') {
    sortBy = '-rating';
  } else if (query?.sort === 'easy') {
    sortBy = 'easy';
  } else if (query?.sort === 'medium') {
    sortBy = '-medium';
  } else if (query?.sort === 'hard') {
    sortBy = '-hard';
  } else if (query?.sort === 'latest') {
    sortBy = '-createdAt';
  }

  const sortQuery = filterQuery.sort(sortBy);

  // Pagination
  let page = 1;
  let limit = 100;
  let skip = 0;

  if (query?.limit) {
    limit = Number(query.limit);
  }
  if (query?.page) {
    page = Number(query.page);
    skip = (page - 1) * limit;
  }

  const paginateQuery = sortQuery.skip(skip).limit(limit);

  // Execute the query and get the total count
  const [result, totalCount] = await Promise.all([
    paginateQuery,
    Recipe.countDocuments(searchQuery.getFilter()) // Count total matching documents
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: result,
    totalCount,
    totalPages,
    currentPage: page,
  };
};

const getRecipeFromDB = async (id: string) => {
  const result = await Recipe.findById(id).populate("author").populate('comment.user', 'name image email');;
  return result;
};
const updateRecipe = async (id: string, payload: TRecipe) => {
  const recipe = await Recipe.findByIdAndUpdate(id, [{ $set: payload }], {
    new: true,
  });
  return recipe;
};

const deleteRecipe = async(id: string)=>{
    const recipe = await Recipe.findByIdAndDelete(id);
    return recipe
}

const upVoteRecipeIntoDB = async (user: JwtPayload, RecipeId: string) => {

  const recipe = await Recipe.findById(RecipeId);

  if (!recipe) {
   throw new AppError(httpStatus.NOT_FOUND,  'Recipe not found')
  }

  // Check if the user already upvoted
  if (recipe.upVotes.includes(user.id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You have already upvoted this recipe')

  }

  // Remove from downvotes if previously downvoted
  recipe.downVotes = recipe.downVotes.filter(vote => vote.toString() !== user.id);

  // Add to upvotes
  recipe.upVotes.push(user.id);
  await recipe.save();
  return recipe

};

const downVoteRecipeIntoDB = async (userId: string, recipeId: string) => {

  console.log({userId, recipeId}, 'down')
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND,  'Recipe not found')
  }

  // Check if the user already downvoted
  if (recipe.downVotes.includes(new Types.ObjectId(userId))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You have already downvoted this recipe')
  }

  // Remove from upvotes if previously upvoted
  recipe.upVotes = recipe.upVotes.filter(vote => vote.toString() !== userId);

  // Add to downvotes
  recipe.downVotes.push(new Types.ObjectId(userId));
  await recipe.save();

 return recipe
  
};

 const commentOnRecipeIntoDb = async (user: JwtPayload, recipeId: string, comment:string) => {

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      throw new AppError(httpStatus.NOT_FOUND,  'Recipe not found')
    }

    // Create a new comment
    recipe.comment.push({_id: new Types.ObjectId(), user:user.id, comment, date: new Date() });
    await recipe.save();

  return recipe
};

const editCommentOnRecipeInDb = async (user: JwtPayload, recipeId: string, commentId: string, newCommentText: string) => {
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  const comment = recipe.comment.find((c) => c._id.equals(commentId));

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  // Check if the user is the author of the comment
  if (comment.user.toString() !== user.id &&  user.role !== 'admin') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Not authorized to edit this comment');
  }

  // Update the comment text
  comment.comment = newCommentText;
  comment.date = new Date(); // Update the date to reflect the edit time

  await recipe.save();

  return recipe;
};

const deleteCommentOnRecipeInDb = async (
  user: JwtPayload,
  recipeId: string,
  commentId: string
) => {
  console.log('Starting delete process for:', { user, recipeId, commentId });

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  // Find the comment index in the recipe's comment array
  const commentIndex = recipe.comment.findIndex((c) => c._id.toString() === commentId);
  if (commentIndex === -1) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  // Check if the user is the author of the comment or if the user is an admin
  const comment = recipe.comment[commentIndex];
  if (!comment.user.equals(user.id) && user.role !== 'admin') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Not authorized to delete this comment');
  }

  // Remove the comment from the recipe's comment array
  recipe.comment.splice(commentIndex, 1);

  await recipe.save();

  return recipe;
};




 const rateRecipeIntoDB = async (user: JwtPayload, recipeId: string, rating: number) => {
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      throw new AppError(httpStatus.NOT_FOUND,  'Recipe not found')

    }

    // Check if the user has already rated
    const existingRating = recipe.rating.find(r => r.user.toString() === user.id);

    if (existingRating) {
      existingRating.rating = rating; 
    } else {
      // Create a new rating
      recipe.rating.push({ user: new Types.ObjectId(user.id), rating });
    }

    await recipe.save();
    return recipe

};

export const RecipeServices = {
  createRecipeIntoDB,
  getAllRecipeFromDB,
  getRecipeFromDB,
  updateRecipe,
  deleteRecipe,
  upVoteRecipeIntoDB,
  downVoteRecipeIntoDB,
  commentOnRecipeIntoDb,
  editCommentOnRecipeInDb,
  deleteCommentOnRecipeInDb,
  rateRecipeIntoDB
};
