import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHUNK_DIR = path.join(__dirname, "../uploads/chunks");
const FILE_DIR = path.join(__dirname, "../uploads/files");

// Ensure the upload directory exists
if (!fs.existsSync(CHUNK_DIR)) {
  fs.mkdirSync(CHUNK_DIR, { recursive: true });
}
if (!fs.existsSync(FILE_DIR)) {
  fs.mkdirSync(FILE_DIR, { recursive: true });
}

export { CHUNK_DIR, FILE_DIR };
