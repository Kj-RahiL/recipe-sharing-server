import { model, Schema } from 'mongoose';
import { TComment } from './comment.interface';

const commentSchema = new Schema<TComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const Comment = model<TComment>('Comment', commentSchema);
