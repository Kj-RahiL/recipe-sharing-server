import { Types } from 'mongoose';

export type TChat = {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  content: string;
  isRead:boolean
};

