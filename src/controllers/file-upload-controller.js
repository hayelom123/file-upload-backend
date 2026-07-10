import catchAsync from "../utils/catch_async.js";
import path from "path";
import { CHUNK_DIR, FILE_DIR } from "./constants.js";

const initFileUploadController = catchAsync(async (req, res) => {
  // Handle file upload logic here
  res.send("File uploaded successfully!");
});

const uploadChunckController = catchAsync(async (req, res) => {
  // Handle chunk upload logic here

  // 1. Extract metadata from custom request headers

  const fileName = req.headers["x-file-name"];
  const chunkIndex = req.headers["x-chunk-index"];
  const totalChunks = req.headers["x-total-chunks"];
  const uploadId = req.headers["x-upload-id"];

  if (!fileName) {
    return res.status(400).json({ error: "Missing x-file-name header" });
  }

  const filePath = path.join(FILE_DIR, fileName);

  // 2. Open a write stream in 'append' mode ('a')
  // This adds the incoming chunk data to the end of the file without overwriting it

  const writeStream = fs.createWriteStream(filePath, { flags: "a" });

  // 3. Pipe the incoming raw binary request body directly into the file
  req.pipe(writeStream);

  writeStream.on("finish", () => {
    console.log(
      `Chunk ${chunkIndex} of ${totalChunks} for upload ID ${uploadId} saved to ${filePath}`,
    );
    // 4. Check if this was the final chunk
    const isFinalChunk = chunkIndex === totalChunks - 1;

    res.status(200).json({
      message: "Chunk uploaded successfully",
      completed: isFinalChunk,
    });
  });

  writeStream.on("error", (err) => {
    console.error(
      `Error writing chunk ${chunkIndex} for upload ID ${uploadId}:`,
      err,
    );
    res.status(500).json({ error: "Failed to save chunk" });
  });
});

const uploadStatusController = catchAsync(async (req, res) => {
  // Handle upload status logic here
  res.send("Upload status retrieved successfully!");
});

const pauseUploadController = catchAsync(async (req, res) => {
  // Handle pause upload logic here
  res.send("Upload paused successfully!");
});

const resumeUploadController = catchAsync(async (req, res) => {
  // Handle resume upload logic here
  res.send("Upload resumed successfully!");
});

const mergeChunksController = catchAsync(async (req, res) => {
  // Handle merge chunks logic here
  res.send("Chunks merged successfully!");
});

const downloadFileController = catchAsync(async (req, res) => {
  // Handle file download logic here
  res.send("File downloaded successfully!");
});

export {
  initFileUploadController,
  uploadChunckController,
  uploadStatusController,
  pauseUploadController,
  resumeUploadController,
  mergeChunksController,
  downloadFileController,
};
