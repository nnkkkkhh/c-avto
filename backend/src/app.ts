import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import authRoutes from "./modules/auth/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import { AuthRequest } from "./modules/auth/auth.types";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: corsOrigins.length > 0 ? corsOrigins : true,
        credentials: true,
    })
);
app.use(helmet());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);
app.use(pinoHttp());
app.use(express.json());

app.get("/health", (_, res) => {
    res.status(200).json({ status: "OK" });
});

app.use("/auth", authRoutes);

app.get("/protected", authMiddleware, (req: AuthRequest, res) => {
    res.status(200).json({
        message: "Access granted",
        userId: req.userId,
        organizationId: req.organizationId,
        role: req.role,
    });
});

app.use(errorMiddleware);
