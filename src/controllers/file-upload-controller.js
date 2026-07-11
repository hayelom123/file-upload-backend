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
