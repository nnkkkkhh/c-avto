import { prisma } from "./db";

async function main() {
    const clinic = await prisma.clinic.create({
        data: {
            name: "Test Clinic",
            phone: "+79999999999",
        },
    });

    console.log("Clinic created:", clinic);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());