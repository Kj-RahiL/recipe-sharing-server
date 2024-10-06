import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { TUser } from "../User/user.interface";
import { User } from "../User/user.model";
import { USER_Role } from "../User/user.constant";
import { TLoginUser } from "./auth.interface";
import config from "../../config";
import jwt from "jsonwebtoken";

const signupFromDB = async (payload: TUser) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw new AppError(httpStatus.FORBIDDEN, "This user already exists");
  }

  payload.role = USER_Role.user;

  const newUser = await User.create(payload);
  return newUser;
};

const loginIntoDB = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const passwordMatch = await isPasswordMatched(
    payload.password,
    user.password
  );
  if (!passwordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Password doesn't match !");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_refresh_expire_in,
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    { expiresIn: config.jwt_refresh_expire_in }
  );

  return {
    accessToken,
    refreshToken
  }
};

export const AuthServices = {
signupFromDB, loginIntoDB
}
