import { execSync } from "child_process";

export default async function setupTests() {
  // Migrate the test database schema:
  execSync("yarn dotenv -e .env.test yarn prisma db push --skip-generate");
}
