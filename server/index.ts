import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Router, Request, Response, NextFunction } from "express";
import { handleDemo } from "./routes/demo";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:3000",
  "https://modx-e7d2b.web.app",
  "https://modx-e7d2b.firebaseapp.com",
];

export function createServer() {
  const app = express();

  // Security headers (X-Frame-Options, CSP, HSTS, X-Content-Type-Options, etc.)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "https://apis.google.com", "https://www.gstatic.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://lh3.googleusercontent.com"],
          connectSrc: [
            "'self'",
            "https://*.googleapis.com",
            "https://*.firebaseio.com",
            "https://api.cloudinary.com",
            "wss://*.firebaseio.com",
          ],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false, // Allow Firebase/Google scripts
    })
  );

  // Restrict CORS to known origins only
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server, curl) only in dev
        if (!origin) {
          if (process.env.NODE_ENV === "production") {
            callback(new Error("No origin — blocked in production"));
          } else {
            callback(null, true);
          }
          return;
        }
        if (ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin ${origin} not allowed`));
        }
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

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
