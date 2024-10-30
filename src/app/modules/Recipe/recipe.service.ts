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
   // Search
   const queryObj = { ...query };
   let searchTerm = '';
   const searchableFields = ['title', 'category', 'tags'];
 
   if (query?.searchTerm) {
     searchTerm = query?.searchTerm as string;
   }
 
   const searchQuery = Recipe.find({
     $or: searchableFields.map((field) => ({
       [field]: { $regex: searchTerm, $options: 'i' },
     })),
   }).populate('author')
 
   // Filter
   const excludeFields = ['searchTerm', 'sort', 'limit', 'page'];
   excludeFields.forEach((el) => delete queryObj[el]);
 
 //   console.log({ query, queryObj });
   const filterQuery = searchQuery.find(queryObj);
 
   // Sorting
 
   let sortBy = '-createdAt'; // Default to latest
 
   if (query?.sort === 'rating') {
     sortBy = '-rating'; // Descending by rating
   } else if (query?.sort === 'easy') {
     sortBy = 'easy'; // Ascending by easy
   } else if (query?.sort === 'medium') {
     sortBy = '-medium'; // Descending by medium
   } else if (query?.sort === 'hard') {
     sortBy = '-hard'; // Descending by hard 
   } else if (query?.sort === 'latest') {
     sortBy = '-createdAt'; // Descending by createdAt (latest first)
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
 
   // Apply skip and limit for pagination
   const paginateQuery = sortQuery.skip(skip).limit(limit);
 
   // Execute the query
   const result = await paginateQuery;
   return result;
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
    recipe.comment.push({ user:user.id, comment, date: new Date() });
    await recipe.save();

  return recipe
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
  rateRecipeIntoDB
};
