import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    totalCount: data.totalCount,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    data: data.data,
  });
};

export default sendResponse;
