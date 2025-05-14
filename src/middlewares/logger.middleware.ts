import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, _: Response, next: NextFunction) => {
  console.log(`Request: ${req.url} - ${req.method}`);

  next();
};
