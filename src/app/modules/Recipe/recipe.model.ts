import { model, Schema } from 'mongoose';
import {
  TComment,
  TIngredient,
  TRating,
  TRecipe,
  TStep,
} from './recipe.interface';

const ingredientSchema = new Schema<TIngredient>({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  isChecked: { type: Boolean, default: false },
  type: { type: String, required: true }, // Example: 'Spice', 'Vegetable', 'Meat'
});

// Step schema
const stepSchema = new Schema<TStep>({
  description: { type: String, required: true },
  duration: { type: String, required: true }, // Ensure duration is provided (in minutes or seconds)
});

// Rating schema
const ratingSchema = new Schema<TRating>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

// Comment schema
const commentSchema = new Schema<TComment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const recipeSchema = new Schema<TRecipe>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [ingredientSchema],
    steps: [stepSchema],
    image: { type: String, required: true },
    cookingTime: { type: String, required: true },
    servings: { type: String, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: 'Invalids difficulty',
      },
    },
    category: [String],
    tags: [String],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: [ratingSchema],
    comment: [commentSchema],
    upVotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downVotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isPublished: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Recipe = model<TRecipe>('recipe', recipeSchema);
