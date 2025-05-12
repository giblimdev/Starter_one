import prisma from "@/lib/prisma";

async function main() {
  // Nettoyer la base de données avant le seeding
  await prisma.user.deleteMany();

  // Créer des utilisateurs

  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      name: "Admin",
      role: "admin",
      emailVerified: true,
      accounts: {
        create: {
          accountId: "admin456",
          providerId: "credentials",
          password: "Admin123!",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "test1@test1.com" },
    update: {},
    create: {
      email: "test1@test1.com",
      name: "Test User",
      role: "user",
      emailVerified: true,
      accounts: {
        create: {
          accountId: "test789",
          providerId: "credentials",
          password: "Test123!",
        },
      },
    },
  });

  console.log("Seeding completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
