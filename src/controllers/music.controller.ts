import { Request, Response } from "express";
import { mkdir, unlink } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import util from "node:util";
import { QualityMap } from "@/interfaces/music.interface";

export const downloadMusic = async (req: Request, res: Response) => {
  const execPromise = util.promisify(exec);
  const { url, format = "mp3" } = req.body;

  const outputDir = path.join(process.cwd(), "downloads");
  const outputFile = `song-${Date.now()}.${format}`;
  const outputPath = path.join(outputDir, outputFile);

  const qualityMap: QualityMap = {
    best: "192",
    medium: "128",
    low: "64",
  } as const;

  const quality: keyof typeof qualityMap = req.body.quality || "best";

  if (!Object.keys(qualityMap).includes(quality)) {
    res.status(400).json({ error: "Quality must be best, medium or low" });
    return;
  }

  const ytdlpCommand = `${path.join(
    process.cwd(),
    "venv",
    "bin",
    "yt-dlp"
  )} --extract-audio --audio-format ${format} --audio-quality ${
    qualityMap[quality] || "192"
  } -o "${outputPath}" "${url}"`;

  try {
    await mkdir(outputDir, { recursive: true });
    const { stderr } = await execPromise(ytdlpCommand);

    if (stderr && !stderr.includes("Destination")) {
      throw new Error(`yt-dlp error: ${stderr}`);
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${outputFile}"`
    );
    res.setHeader(
      "Content-Type",
      `audio/${format === "mp3" ? "mpeg" : format}`
    );

    const fileStream = fs.createReadStream(outputPath);
    fileStream.pipe(res);

    fileStream.on("end", async () => {
      try {
        await unlink(outputPath);
      } catch (error) {
        console.log(`Error deleting file: ${error}`);
      }
    });

    fileStream.on("error", (error) => {
      console.log(`Stream error: ${error}`);
      res.status(500).json({ error: `Error streaming file` });
    });
  } catch (error) {
    console.log(`Error at downloadMusic: ${error}`);

    try {
      await unlink(outputPath).catch(() => {});
    } catch (cleanUpError) {
      console.log(`Cleanup error: ${cleanUpError}`);
    }

    res.status(500).json({ error: "Internal server error" });
  }
};
