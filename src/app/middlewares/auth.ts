import httpStatus from "http-status";
import AppError from "../errors/appError";
import { USER_Role } from "../modules/User/user.constant";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { User } from "../modules/User/user.model";

const Auth = (...requiredRoles: (keyof typeof USER_Role)[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized tok tok"
      );
    }
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
    const { role, email } = decoded;

    // checking existing user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    }
    if(!requiredRoles.includes(role)){
        throw new AppError(
            httpStatus.UNAUTHORIZED, "You are not authorized to access this route"
        )
    }
    next()
  });
};
