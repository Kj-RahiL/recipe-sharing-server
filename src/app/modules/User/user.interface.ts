import { Types } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  image: string;
  bio: string;
  followers: Types.ObjectId[], 
  following:Types.ObjectId[], 
  role?: 'user' | 'member' | 'admin';
  passwordChangeAt?: Date;
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};
