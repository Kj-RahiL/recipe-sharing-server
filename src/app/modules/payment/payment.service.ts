import { readFileSync } from 'fs';
import { join } from 'path';
import { verifyPayment } from './payment.utils';
import { Order } from '../order/order.model';
import { User } from '../User/user.model';

const confirmationServices = async (transactionId: string, status: string) => {


  const verifyResponse = await verifyPayment(transactionId);
  console.log(verifyResponse.data.pay_status);

  let result;
  let message = '';
  let statusClass = '';
  let description = '';

  if (verifyResponse.data && verifyResponse.data.pay_status === 'Successful') {
    result = await Order.findOneAndUpdate(
      { transactionId },
      { paymentStatus: 'paid' }
    );
    await User.findOneAndUpdate(
      {email: result?.user?.email}, 
      { isPaid: true});

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

  // Debug the resolved file path
  const filePath = join(__dirname, '../../views/confirmation.html');
  // const filePath = join(process.cwd(), '../../views/confirmation.html');
  
  console.log(`Resolved file path: ${filePath}`);

  try {
    let template = readFileSync(filePath, 'utf-8');
    template = template
      .replace('{{message}}', message)
      .replace('{{statusClass}}', statusClass)
      .replace('{{description}}', description);

    return template;
  } catch (error) {
    console.error('Error reading template:', error);
    throw new Error('Template file not found or could not be read.');
  }

};

export const paymentServices = {
  confirmationServices,
};
