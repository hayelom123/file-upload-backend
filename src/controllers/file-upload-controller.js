import catchAsync from "../utils/catch_async.js";
import path from "path";
import fs from "fs";
import { CHUNK_DIR, FILE_DIR } from "./constants.js";
import {
  uploadChunkService,
  mergeChunksService,
} from "../services/file-service.js";

const initFileUploadController = catchAsync(async (req, res) => {
  // Handle file upload logic here
  res.send("File uploaded successfully!");
});
const uploadChunckController = catchAsync(async (req, res) => {
  const result = await uploadChunkService({
    uploadId: req.params.uploadId,
    chunkIndex: Number(req.params.chunkIndex),
    totalChunks: Number(req.get("x-total-chunks")),
    stream: req,
  });
  console.log(
    `Chunk ${req.params.chunkIndex} of ${req.get("x-total-chunks")} for upload ID ${req.params.uploadId} saved successfully.`,
  );
  console.log(
    `Upload status: ${result.completed ? "Completed" : "In Progress"}`,
  );
  if (result.completed) {
    // If the upload is completed, you can perform any additional actions here
    console.log(
      `Upload with ID ${req.params.uploadId} completed successfully.`,
    );
    const rawFileName = req.get("x-file-name");
    if (!rawFileName) {
      return res.status(400).json({ error: "Missing X-File-Name header" });
    }
    // Decode the file name to handle special characters
    const fileName = decodeURIComponent(rawFileName);
    await mergeChunksService({
      uploadId: req.params.uploadId,
      fileName: fileName,
      totalChunks: Number(req.get("x-total-chunks")),
    });
  }

  res.status(201).json(result);
});
const uploadChunckController1 = catchAsync(async (req, res) => {
  const rawFileName = req.headers["x-file-name"];
  // Ensure we parse headers to Numbers for arithmetic comparisons later
  const chunkIndex = parseInt(req.headers["x-chunk-index"], 10);
  const totalChunks = parseInt(req.headers["x-total-chunks"], 10);
  const uploadId = req.headers["x-upload-id"];

  if (!rawFileName) {
    return res.status(400).json({ error: "Missing x-file-name header" });
  }
  // Decode the file name to handle special characters
  const fileName = decodeURIComponent(rawFileName);
  // Fallback: If middleware parsed it into a Buffer, use req.body
  // If no middleware touched it, we can fallback to reading stream data manually
  const chunkBuffer = Buffer.isBuffer(req.body) ? req.body : req.rawBody;

  if (!chunkBuffer || chunkBuffer.length === 0) {
    return res
      .status(400)
      .json({ error: "No data payload received in request body" });
  }

  const filePath = path.join(FILE_DIR, fileName);

  // Use appendFile to safely attach the raw buffer to the file synchronously or asynchronously
  fs.appendFile(filePath, chunkBuffer, (err) => {
    if (err) {
      console.error(
        `Error writing chunk ${chunkIndex} for upload ID ${uploadId}:`,
        err,
      );
      return res.status(500).json({ error: "Failed to save chunk" });
    }

    console.log(
      `Chunk ${chunkIndex} of ${totalChunks} for upload ID ${uploadId} saved to ${filePath}`,
    );

    // Check if this was the final chunk (ensure types match as integers)
    const isFinalChunk = chunkIndex === totalChunks - 1;

    res.status(200).json({
      message: "Chunk uploaded successfully",
      chunkIndex,
      totalChunks,
      uploadId,
      completed: isFinalChunk,
    });
  });
});

const uploadChunckController2 = catchAsync(async (req, res) => {
  // 1. Extract metadata from custom request headers
  const rawFileName = req.headers["x-file-name"];
  const totalChunks = req.headers["x-total-chunks"];
  const { uploadId, chunkIndex } = req.params;

  if (!rawFileName) {
    return res.status(400).json({ error: "Missing x-file-name header" });
  }
  // Decode the file name to handle special characters
  const fileName = decodeURIComponent(rawFileName);
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
      chunkIndex,
      totalChunks,
      uploadId,
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
