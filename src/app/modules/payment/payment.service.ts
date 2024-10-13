import { readFileSync } from 'fs';
import { verifyPayment } from './payment.utils';
import { join } from 'path';

const confirmationServices = async (transactionId: string, status: string) => {
  const verifyResponse = await verifyPayment(transactionId);
  console.log(verifyResponse.data.pay_status);

  let result;
  let message = '';
  let statusClass = '';
  let description = '';

  if (verifyResponse.data && verifyResponse.data.pay_status === 'Successful') {
    // result = await Booking.findOneAndUpdate(
    //   { transactionId },
    //   { paymentStatus: 'paid' },
    // );
    message = 'Payment Successful!';
    statusClass = 'success';
    description =
      'Your payment was processed successfully. Thank you for your purchase!';
  } else {
    message = 'Payment Failed';
    statusClass = 'failed';
    description =
      'Unfortunately, your payment could not be processed. Please try again or contact support for assistance.';
  }
  const filePath = join(__dirname, '../../../view/index.html');
  let template = readFileSync(filePath, 'utf-8');
  template = template
    .replace('{{message}}', message)
    .replace('{{statusClass}}', statusClass)
    .replace('{{description}}', description);

  return template;
};

export const paymentServices = {
  confirmationServices,
};
