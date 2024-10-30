import catchAsync from '../../utils/catchAsync';
import { orderServices } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  // const { transactionId, paymentStatus } = req.query;
  const { price, duration } = req.body;
  const result = await orderServices(
    req.user.id,
    price,
    duration,
  );
  res.send(result);
});

export const OrderController = {
  createOrder
};
