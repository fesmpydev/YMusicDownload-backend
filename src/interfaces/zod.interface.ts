import { z } from "zod";

export interface ValidateZodScheme {
  scheme: z.ZodSchema;
  input?: "body" | "params" | "query";
}
