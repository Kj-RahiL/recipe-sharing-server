
export type TOrder =  {
  user: {
      name: string,
      email: string,
      phone: string,
  };
  price: number;
  duration:string;
  status: string;
  paymentStatus: string;
  transactionId: string;
}
