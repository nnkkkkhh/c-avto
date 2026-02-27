import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface RegisterInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName: string;
}

interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    organizationId: string;
}

interface AuthResponse {
    user: AuthUser;
    token: string;
}

export class AuthService {
    private signToken(user: { id: string; organizationId: string; role: Role }): string {
        return jwt.sign(
            {
                userId: user.id,
                organizationId: user.organizationId,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );
    }

    async register(input: RegisterInput): Promise<AuthResponse> {
        const { email, password, firstName, lastName, organizationName } = input;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.$transaction(async (tx) => {
            const organization = await tx.organization.create({
                data: { name: organizationName },
            });

            return tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    organizationId: organization.id,
                    role: Role.OWNER,
                },
            });
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                organizationId: user.organizationId,
            },
            token: this.signToken(user),
        };
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new Error("Invalid credentials");
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                organizationId: user.organizationId,
            },
            token: this.signToken(user),
        };
    }

    async getUserById(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                organizationId: true,
            },
        });
    }
}
