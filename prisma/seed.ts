/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const testUrl = "https://google.ca"

  await prisma.shortenedUrl.upsert({
    where: {
      originalUrl: testUrl,
    },
    create: {
      originalUrl: testUrl
    },
    update: {},
  });
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
