import axios from 'axios';
import config from '../../config';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';

export const initialPayment = async (paymentData: any) => {
  const res = await axios.post(config.payment_url!, {
    store_id: config.store_id,
    signature_key: config.signature_key,
    tran_id: paymentData.transactionId,
    success_url: `https://recipe-sharing-server-olive.vercel.app/api/payConfirm?transactionId=${paymentData.transactionId}&status=success`,
    fail_url: `https://recipe-sharing-server-olive.vercel.app/api/payConfirm?status=failed`,
    cancel_url: `http://localhost:3000/feed`,
    amount: paymentData.price,
    currency: 'BDT',
    desc: 'Merchant Registration order',
    cus_name: paymentData.customerName,
    cus_email: paymentData.customerEmail,
    cus_add1: 'Bangladesh',
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
    throw new AppError(httpStatus.FORBIDDEN, 'order validation failed');
  }
};
