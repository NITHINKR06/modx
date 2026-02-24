import "dotenv/config";
import express from "express";
import cors from "cors";
import { Router, Request, Response, NextFunction } from "express";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // All API routes live under /api — non-API requests call next() automatically
  const apiRouter = Router();
  apiRouter.get("/ping", (_req: Request, res: Response) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  apiRouter.get("/demo", handleDemo);
  app.use("/api", apiRouter);

  return app;
}
