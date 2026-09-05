import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

// Start the server

const server = app.listen(PORT, () => {
  console.log(
    `File upload backend server is running on http://localhost:${PORT}`,
  );
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});
