import mongoose, { Schema, Document, model } from 'mongoose';
import { TOrder } from './order.interface';


const orderSchema = new Schema<TOrder>(
  {
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
export const Order = model<TOrder>('order', orderSchema);
