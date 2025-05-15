import { Router } from "express";
import { downloadMusic } from "@/controllers/music.controller";
import { musicScheme } from "@/schemas/music.scheme";
import { validateZodScheme } from "@/middlewares/zod.middleware";

export const music = Router();

music.post(
  "/download",
  validateZodScheme({ scheme: musicScheme }),
  downloadMusic
);
