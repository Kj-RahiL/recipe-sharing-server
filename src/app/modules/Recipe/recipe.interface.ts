import { Types } from 'mongoose';

export type TIngredient = {
  name: string;
  quantity: string;
  isChecked?: boolean; 
  type?: string; 
};

export type TStep = {
  description: string;
  duration?: string; 
};

export type TRating = {
  user: Types.ObjectId;
  rating: number;
};

export type TComment = {
  user: Types.ObjectId;
  comment: string;
  date: Date;
};

export type TRecipe = {
  title: string;
  description: string;
  ingredients: TIngredient[];
  steps: TStep[];
  image: string;
  cookingTime: string;
  servings: string;
  difficulty: string;
  category: string[];
  tags?: string[]; 
  author: Types.ObjectId;
  rating: TRating[];
  comment: TComment[];
  upVotes: Types.ObjectId[];
  downVotes: Types.ObjectId[];
  isPublished: boolean;
  isPremium: boolean;
};
