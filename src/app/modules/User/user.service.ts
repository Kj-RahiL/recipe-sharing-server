import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { USER_Role } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';
import mongoose, { Types } from 'mongoose';

const createAdminIntoDB = async (payload: TUser) => {
  const user = await User.findOne({ email: payload.email });

  payload.role = USER_Role.admin;
  if (user) {
    const admin = await User.findByIdAndUpdate(user._id, payload);
    return admin;
  }

  const admin = await User.create(payload);
  return admin;
};
const getAllUser = async () => {
  const result = await User.find();
  return result;
};
const getUserFromDB = async (id: string) => {

  const user = await User.findById(id);
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found.');
  }
   if(user.status === "blocked"){
    throw new AppError(httpStatus.BAD_REQUEST, 'Cannot get user');
   }
  return user;
};

const followUserIntoDB = async (userId: string, followId: string) => {
  if (userId === followId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cannot follow yourself.');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [user, followUser] = await Promise.all([
      User.findById(new Types.ObjectId(userId)).session(session),
      User.findById(new Types.ObjectId(followId)).session(session),
    ]);

    if (!user || !followUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
    }

    // Convert followId to ObjectId for the comparison
    const followObjectId = new Types.ObjectId(followId);

    if (user.following.some((id) => id.equals(followObjectId))) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Already following this user.');
    }

    // Push the new follower and following IDs
    user.following.push(followObjectId);
    followUser.followers.push(new Types.ObjectId(userId));

    await Promise.all([user.save({ session }), followUser.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};



const unFollowUserIntoDB = async (userId: string, followId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start a new transaction

  try {
    // Remove 'followId' from the 'following' list of 'userId'
    await User.updateOne(
      { _id: userId },
      { $pull: { following: followId } },
      { session }
    );

    // Remove 'userId' from the 'followers' list of 'followId'
    await User.updateOne(
      { _id: followId },
      { $pull: { followers: userId } },
      { session }
    );

    // Commit the transaction if successful
    await session.commitTransaction();
    session.endSession();

    return
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    session.endSession();
    throw error; // Pass the error to global error handler
  }
};

const updateUser = async (id: string, payload: TUser) => {
  const user = await User.findByIdAndUpdate(id, payload);
  return user;
};

export const UserServices = {
  createAdminIntoDB,
  getUserFromDB,
  updateUser,
  getAllUser,followUserIntoDB, unFollowUserIntoDB
};
