import { NextFunction, Request, Response } from "express";
import CustomError from "../../../error/CustomError";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error caught: ", err);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  return res.status(500).json({ error: "Internal server error." });
};

export default errorHandler;
