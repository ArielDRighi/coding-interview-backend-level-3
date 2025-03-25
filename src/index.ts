import { initializeServer, startServer } from "./server";

// Manejo de errores no capturados
process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

// Función asíncrona autoinvocada para iniciar el servidor
(async () => {
  try {
    await startServer();
    console.log("Server started successfully");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
