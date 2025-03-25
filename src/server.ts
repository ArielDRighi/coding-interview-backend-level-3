import Hapi from "@hapi/hapi";
import { defineRoutes } from "./routes";
import prisma from "./database/client";

const getServer = () => {
  const server = Hapi.server({
    host: "localhost",
    port: 3000,
  });

  defineRoutes(server);

  return server;
};

export const initializeServer = async () => {
  const server = getServer();
  await server.initialize();

  // Connect to the database
  await prisma.$connect();

  // Clean database for tests
  if (process.env.NODE_ENV !== "production") {
    await prisma.item.deleteMany();
  }

  return server;
};

export const startServer = async () => {
  const server = getServer();
  await server.start();

  // Connect to the database
  await prisma.$connect();

  console.log(`Server running on ${server.info.uri}`);
  return server;
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
