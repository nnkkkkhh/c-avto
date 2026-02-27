import { Request } from "express";
import { Role } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export interface AuthTokenPayload extends JwtPayload {
    userId: string;
    organizationId: string;
    role: Role;
}

export interface AuthRequest extends Request {
    userId?: string;
    organizationId?: string;
    role?: Role;
}
