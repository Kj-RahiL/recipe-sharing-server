import catchAsync from '../../utils/catchAsync';
import { paymentServices } from './payment.service';

const confirmationController = catchAsync(async (req, res) => {
  const { transactionId, paymentStatus } = req.query;
  const result = await paymentServices.confirmationServices(
    transactionId as string,
    paymentStatus as string,
  );
  res.send(result);
});

export const PaymentController = {
  confirmationController,
};
