export type TUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  image: string;
  role?: 'user' | 'member' | 'admin';
  passwordChangeAt?: Date;
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};
