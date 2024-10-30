import { readFileSync } from 'fs';
import { join } from 'path';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../User/user.model';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import { initialPayment } from '../payment/payment.utils';
import { Order } from './order.model';

export const orderServices = async (
  userId: string,
  price: number,
  duration: string,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }
  const transactionId = `TXN-${Date.now()}`;

  const payUser = new Order({
    user,
    price,
    duration,
    paymentStatus: 'Pending',
    transactionId,
  });

  await payUser.save();

  const paymentData = {
    transactionId,
    price,
    customerName: user.name,
    customerEmail: user.email,
    customerPhone: user.phone,
  };
  const paymentSession = await initialPayment(paymentData);
  console.log(paymentSession);
  return paymentSession;
};

