import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { TUser } from '../User/user.interface';
import { User } from '../User/user.model';
import { USER_Role } from '../User/user.constant';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { isPasswordMatched } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

const signupFromDB = async (payload: TUser) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user already exists');
  }

  payload.role = USER_Role.user;

  const newUser = await User.create(payload);
  return newUser;
};

const loginIntoDB = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const passwordMatch = await isPasswordMatched(
    payload.password,
    user.password,
  );
  if (!passwordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Password doesn't match !");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image,
    status: user.status,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    isPaid: user.isPaid
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_refresh_expire_in,
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    { expiresIn: config.jwt_refresh_expire_in },
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.findOne({ email: userData.email }).select("+password");
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");


  const passwordMatch = await isPasswordMatched(payload.oldPassword, user.password);
  console.log("Password Match Result:", passwordMatch);

  if (!passwordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Password doesn't match!");
  }

  const newHashPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));
  
  await User.findOneAndUpdate(
    { _id: user._id },
    {
      password: newHashPassword,
      passwordChangeAt: new Date(),
    }
  );

  return user;
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { email, iat } = decoded;

  // checking user existing
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  // checking if user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
  }
  const isJWTIssuedBeforePasswordChanged = (
    passwordChangeAt: Date,
    iat: number,
  ): boolean => {
    const jwtIssuedTimestamp = iat * 1000;

    if (!passwordChangeAt) return false;

    const passwordTimestamp = new Date(passwordChangeAt).getTime();
    return jwtIssuedTimestamp < passwordTimestamp;
  };

  // Check if the password was changed after the JWT was issued
  if (
    user.passwordChangeAt &&
    isJWTIssuedBeforePasswordChanged(user.passwordChangeAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  //   create token and sent client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expire_in as string,
  });
  return { accessToken };
};

const forgetPassword = async (email: string) => {
  
  // checking if the user is exist
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const resetToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10m',
  });


  const resetUILink = `${config.reset_pass_ui_link}/reset-password?email=${user.email}&token=${resetToken} `;

  sendEmail(user.email, resetUILink);
  // sendEmail();
  
  console.log(resetUILink,user.email );
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await User.findOne({ email : payload?.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

  if (payload.email !== decoded.email) {
    console.log(payload.email, decoded.email);
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );
};


export const AuthServices = {
  signupFromDB,
  loginIntoDB,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword
};
