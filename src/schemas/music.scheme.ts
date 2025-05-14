import { z } from "zod";

export const musicScheme = z.object({
  url: z.string({ message: "url must be a string" }).min(1, "url is required"),
  format: z.enum(["low", "medium", "best"]),
  quality: z.enum(["mp3", "wav", "m4a"]),
});
