import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ValidateZodScheme } from "@/interfaces/zod.interface";

export const validateZodScheme = ({
  scheme,
  input = "body",
}: ValidateZodScheme) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      scheme.parse(req[input]);

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(`Error at validateZodScheme: ${error}`);
        const errors = error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }));

        res.status(400).json({ error: errors });
        return;
      }

      console.log(`Error at validateZodScheme: ${error}`);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  };
};
