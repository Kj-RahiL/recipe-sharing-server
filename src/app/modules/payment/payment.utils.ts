import axios from 'axios';
import config from '../../config';
import { TPayment } from './payment.interface';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';

export const initialPayment = async (paymentData: TPayment) => {
  const res = await axios.post(config.payment_url!, {
    store_id: config.store_id,
    signature_key: config.signature_key,
    tran_id: paymentData.transactionId,
    success_url: `http://localhost:5000/api/payment?transactionId=${paymentData.transactionId}&status=success`,
    fail_url: `http://localhost:5000/api/payment?status=failed`,
    cancel_url: `http://localhost:5173/facility`,
    amount: paymentData.totalPrice,
    currency: 'BDT',
    desc: 'Merchant Registration Payment',
    cus_name: paymentData.customerName,
    cus_email: paymentData.customerEmail,
    cus_add1: paymentData.customerAddress,
    cus_add2: 'N/A',
    cus_city: 'N/A',
    cus_state: 'N/A',
    cus_postcode: 'N/A',
    cus_country: 'Bangladesh',
    cus_phone: paymentData.customerPhone,
    type: 'json',
  });

  return res.data;
};

export const verifyPayment = async (tnxId: string) => {
  try {
    const res = await axios.get(config.payment_verify_url!, {
      params: {
        store_id: config.store_id,
        signature_key: config.signature_key,
        type: 'json',
        request_id: tnxId,
      },
    });
    return res;
  } catch (error) {
    throw new AppError(httpStatus.FORBIDDEN, 'payment validation failed');
  }
};
