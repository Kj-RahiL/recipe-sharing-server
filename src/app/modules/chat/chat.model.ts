import { model, Schema } from 'mongoose';
import { TChat } from './chat.interface';

const chatSchema = new Schema<TChat>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
    content: { type: String, required: true },
    isRead:{type:Boolean, default:false}
  },
  {
    timestamps: true,
  },
);

export const Chat = model<TChat>('Chat', chatSchema);
