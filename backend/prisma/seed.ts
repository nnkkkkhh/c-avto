import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    const organizationName = process.env.SEED_ORG_NAME || "Default Org";

    if (!email || !password) {
        console.log("Seed skipped: SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD is missing");
        return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log("Seed skipped: user already exists");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const organization = await prisma.organization.create({
        data: { name: organizationName },
    });

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName: "Admin",
            lastName: "User",
            role: Role.OWNER,
            organizationId: organization.id,
        },
    });

    console.log("Seed completed");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
