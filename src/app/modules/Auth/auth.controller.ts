import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { User } from '../User/user.model';
import { AuthServices } from './auth.service';

const signup = catchAsync(async (req, res) => {
  const result = await AuthServices.signupFromDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await AuthServices.loginIntoDB(
    req.body,
  );

  const user = await User.findOne({ email: req.body.email });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
  });
  res.status(201).json({
    statusCode: 200,
    success: true,
    message: 'User logged in successfully!',
    token: accessToken,
    data: user,
  });
});

const changePassword = catchAsync(async (req, res) => {

  const result = await AuthServices.changePassword(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated succesfully!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successful',
    data: result,
  });
});
export const AuthControllers = {
  signup,
  login,
  changePassword,
  refreshToken,
};
