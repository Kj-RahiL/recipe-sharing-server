import { z } from 'zod';

// Ingredient Schema
const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required."),
  quantity: z.string().min(1, "Quantity is required."),
  isChecked: z.boolean().default(false),  // Optional with default
  type: z.string().min(1).optional(),  // Example: "Vegetable", "Spice"
});

// Step Schema
const stepSchema = z.object({
  description: z.string().min(1, "Description is required."),
  duration: z.number().min(1, "Duration must be at least 1 minute."),
});

// Rating Schema
const ratingSchema = z.object({
  user: z.string().min(1, "User ID is required."),  // Assuming ObjectId as string
  rating: z.number().min(1).max(5),  // Rating between 1 and 5
});

// Comment Schema
const commentSchema = z.object({
  user: z.string().min(1, "User ID is required."),
  comment: z.string().min(1, "Comment cannot be empty."),
  date: z.date().default(new Date()),  // Optional, defaults to current date
});

// Recipe Schema
export const recipeValidationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required."),
  steps: z.array(stepSchema).min(1, "At least one step is required."),
  image: z.string().url("Image must be a valid URL."),
  cookingTime: z.string().min(1, "Cooking time is required."), 
  servings: z.string().min(1, "Servings are required."),  
  difficulty: z.enum(['easy', 'medium', 'hard']),
  category: z.array(z.string()).min(1, "At least one category is required."),
  tags: z.array(z.string()).optional(),
  author: z.string().min(1, "Author ID is required."), 
  rating: z.array(ratingSchema).optional(),  
  comment: z.array(commentSchema).optional(),  
  upVotes: z.array(z.string()).optional(),
  downVotes: z.array(z.string()).optional(),  
  isPublished: z.boolean().default(true),  
  isPremium: z.boolean().default(false),  
});

// Example of using Zod schema for validation
const exampleRecipe = {
  title: "Chocolate Cake",
  description: "A delicious and easy-to-make chocolate cake recipe.",
  ingredients: [
    { name: "Flour", quantity: "2 cups", type: "Dry" },
    { name: "Sugar", quantity: "1 cup", type: "Sweetener" },
  ],
  steps: [{ description: "Mix ingredients", duration: 10 }],
  image: "https://example.com/cake.jpg",
  cookingTime: "1 hour",
  servings: "8",
  difficulty: "easy",
  category: ["Dessert"],
  tags: ["vegetarian", "gluten-free"],
  author: "64e545a2f5b6c2a001c9c8b0",  // Example ObjectId
};

// Validate recipe
const parsedRecipe = recipeValidationSchema.safeParse(exampleRecipe);

if (!parsedRecipe.success) {
  console.log(parsedRecipe.error.format());  // Output validation errors
} else {
  console.log("Recipe is valid:", parsedRecipe.data);
}
