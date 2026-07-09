// import { Request, Response, NextFunction } from "express";
// import { AnyZodObject, ZodError } from "zod/v3";

// const validate = (schema: AnyZodObject) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       schema.parse(req.body);
//       next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         return res.status(400).json({
//           success: false,
//           message: "Validation failed",
//           errors: error.issues.map((e) => ({
//             field: e.path.join("."),
//             message: e.message,
//           })),
//         });
//       }
//       next(error);
//     }
//   };
// };

// export default validate;

import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

const validate = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errorDetails: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
};

export default validate;
