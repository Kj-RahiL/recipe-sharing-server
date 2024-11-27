import { Types } from 'mongoose';

export type TComment = {
  user: Types.ObjectId;
  recipe: Types.ObjectId;
  comment: string;
  date: Date;
};
