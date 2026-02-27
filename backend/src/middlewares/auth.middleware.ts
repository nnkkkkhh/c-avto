import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, AuthTokenPayload } from "../modules/auth/auth.types";

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(500).json({ message: "JWT secret is not configured" });
        return;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        res.status(401).json({ message: "Invalid token format. Use Bearer <token>" });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as AuthTokenPayload;
        req.userId = decoded.userId;
        req.organizationId = decoded.organizationId;
        req.role = decoded.role;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
}
