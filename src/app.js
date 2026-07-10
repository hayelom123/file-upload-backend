import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";
import fileUploadRoutes from "./routes/file_upload_route.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const __publicDir = path.join(__dirname, "public");

// console.log(__filename);
// console.log(__dirname);
// console.log(__publicDir);

app.use(
  "/api/file-upload",
  // express.raw({
  //   type: "application/octet-stream",
  //   limit: "10mb",
  // }),
  fileUploadRoutes,
);

// Serve static files from the public directory
app.use(express.static(__publicDir));
// Middleware to parse JSON requests
// app.use(express.json());

// Use the router for handling routes
app.use("/api", router);

export default app;

// file upload backend server steps

// Phase 1 (Get it working)
// ✅ Chunk upload
// ✅ Pause
// ✅ Resume
// ✅ Merge
// ✅ Download
// ✅ PostgreSQL
// ✅ Local disk storage

// Phase 2 (Make it production-ready)
// ✅ SHA-256 verification
// ✅ Parallel uploads
// ✅ Retry with exponential backoff
// ✅ Background merge workers
// ✅ Cleanup jobs
// ✅ Progress API
// ✅ Authentication and permissions

// Phase 3 (Scale it)
// ✅ Deduplication
// ✅ Global scheduler
// ✅ Multiple worker processes
// ✅ Distributed storage across multiple servers
// ✅ File replication (store copies on different servers)
// ✅ Monitoring and metrics
// ✅ Storage balancing and automatic recovery
