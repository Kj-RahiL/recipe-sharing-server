import { TRecipe } from "./recipe.interface";
import { Recipe } from "./recipe.model";

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
     sortBy = 'price'; // Ascending by easy
   } else if (query?.sort === 'medium') {
     sortBy = '-price'; // Descending by medium
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
  const result = await Recipe.findById(id).populate("author");
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
export const RecipeServices = {
  createRecipeIntoDB,
  getAllRecipeFromDB,
  getRecipeFromDB,
  updateRecipe,
  deleteRecipe
};
