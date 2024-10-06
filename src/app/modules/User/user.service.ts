import { USER_Role } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';

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
const getUserFromDB = async (email: string) => {
  const result = await User.findOne({ email });
  return result;
};
const updateUser = async (id: string, payload: TUser) => {
  const admin = await User.findByIdAndUpdate(id, payload);
  return admin;
};

export const UserServices = {
  createAdminIntoDB,
  getUserFromDB,
  updateUser,
  getAllUser,
};
