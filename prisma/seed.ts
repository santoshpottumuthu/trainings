import { hash } from "bcryptjs";
import { adminSeedSchema } from "../src/lib/auth/admin-seed-schema";
import { prisma } from "../src/lib/prisma";

async function seedAdministrator() {
  const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } =
    adminSeedSchema.parse(process.env);
  const username = ADMIN_USERNAME.toLowerCase();
  const email = ADMIN_EMAIL.toLowerCase();
  const passwordHash = await hash(ADMIN_PASSWORD, 12);

  await prisma.user.upsert({
    where: { username },
    create: { username, email, passwordHash, isAdmin: true },
    update: { email, passwordHash, isAdmin: true },
  });

  console.info("Administrator account seeded.");
}

seedAdministrator()
  .catch((error: unknown) => {
    console.error("Administrator seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
