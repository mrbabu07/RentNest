// import { Request, Response, NextFunction } from 'express';

// interface CustomError extends Error {
//     statusCode?: number;
//     message: string;

// }
// const errorHandler = (
//     err: CustomError,
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => { 
//     const statusCode = err.statusCode || 500;
//     const message = err.message || 'something went wrong';

//     console.error(err);
//     res.status(statusCode).json({
//         success: false,
//         message,
//     });
// }

// export default errorHandler;

import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  errorDetails?: any;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: err.errorDetails || null,
  });
};

export default errorHandler;