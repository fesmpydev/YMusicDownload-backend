import express, { Express } from "express";
import path from "node:path";
import { corsConfig } from "@/config/cors";
import { music } from "@/routes/music.route";
import { logger } from "./middlewares/logger.middleware";

export const app: Express = express();

app.disable("x-powered-by");
app.use(corsConfig);
app.use(express.json());
app.use("/downloads", express.static(path.join(process.cwd(), "downloads")));

app.use(logger);

app.use("/api/v1/music", music);
