// One-off script to create (or reset the password of) an admin/HR login.
// Not wired into the build — run it by hand whenever a new admin user is
// needed:
//
//   npx tsx prisma/seed-admin.ts "hr@tnega.tn.gov.in" "a-strong-password" "HR Team"
//
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const [, , email, password, name = "Admin"] = process.argv;
  if (!email || !password) {
    console.error('Usage: npx tsx prisma/seed-admin.ts "<email>" "<password>" "[name]"');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.adminUser.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name, role: "hr" },
  });

  console.log(`Admin user ready: ${user.email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
