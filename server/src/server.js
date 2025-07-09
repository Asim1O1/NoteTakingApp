import app from "./app.js";
import { PORT } from "./constants/env.js";

const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server running in  mode on port ${PORT}...`);
    });

    // Graceful shutdown handling
    const shutdown = (signal) => {
      console.log(`\n${signal} signal received: closing HTTP server`);
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });

      // Force close if not closed in time
      setTimeout(() => {
        console.error("Forcing server shutdown");
        process.exit(1);
      }, 5000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      shutdown("UNHANDLED_REJECTION");
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      shutdown("UNCAUGHT_EXCEPTION");
    });
  } catch (error) {
    console.error("Fatal error during server startup:", error);
    process.exit(1);
  }
};

startServer();
