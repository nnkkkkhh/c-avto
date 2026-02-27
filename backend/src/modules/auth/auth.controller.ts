import { Request, Response } from "express";
import { AuthRequest } from "./auth.types";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { email, password, firstName, lastName, organizationName } = req.body;

            if (!email || !password || !firstName || !lastName || !organizationName) {
                res.status(400).json({
                    message: "email, password, firstName, lastName and organizationName are required",
                });
                return;
            }

            const result = await authService.register({
                email,
                password,
                firstName,
                lastName,
                organizationName,
            });

            res.status(201).json(result);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Registration failed";
            res.status(400).json({ message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: "email and password are required" });
                return;
            }

            const result = await authService.login(email, password);
            res.status(200).json(result);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Login failed";
            res.status(401).json({ message });
        }
    }

    static async me(req: AuthRequest, res: Response) {
        try {
            if (!req.userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const user = await authService.getUserById(req.userId);

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            res.status(200).json({ user });
        } catch {
            res.status(500).json({ message: "Failed to fetch user" });
        }
    }
}
