import { Request, Response } from 'express';
import httpStatus from 'http-status';

const noData = (req: Request, res: Response) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    message: 'No Data Found!',
    data: [],
  });
};

export default noData;
