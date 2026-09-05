import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

console.log(process.env.PORT);
// Start the server

const server = app.listen(PORT, "0.0.0.0", () => {
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
