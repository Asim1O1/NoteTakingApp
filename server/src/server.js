import app from "./app.js";
import { PORT } from "./constants/env.js";
import { logger } from "./utils/logger.js";

const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      logger.info(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
      logger.info(
        `API documentation available at http://localhost:${PORT}/api-docs`
      );
    });

    // Graceful shutdown handling
    const shutdown = (signal) => {
      logger.warn(`${signal} signal received: closing HTTP server`);
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });

      // Force close if not closed in time
      setTimeout(() => {
        logger.error("Forcing server shutdown");
        process.exit(1);
      }, 5000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      logger.error("Unhandled Rejection: " + err.message, { stack: err.stack });
      shutdown("UNHANDLED_REJECTION");
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception: " + err.message, { stack: err.stack });
      shutdown("UNCAUGHT_EXCEPTION");
    });
  } catch (error) {
    logger.error("Fatal error during server startup", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

startServer();
