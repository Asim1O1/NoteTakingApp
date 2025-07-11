import { logger } from "../utils/logger.js";
import prisma from "../utils/prisma.js";

async function deleteAllUsers() {
  try {
    const result = await prisma.user.deleteMany();
    logger.info(` Deleted ${result.count} users from the database.`);
  } catch (error) {
    logger.error("❌ Error deleting users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllUsers();
