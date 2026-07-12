import catchAsync from "../utils/catch_async.js";
import path from "path";
import fs from "fs";
import { CHUNK_DIR, FILE_DIR } from "./constants.js";
import {
  intitFileUploadService,
  uploadChunkService,
  mergeChunksService,
  getDbService,
  getFileByUploadIdService,
} from "../services/file-service.js";

const initFileUploadController = catchAsync(async (req, res) => {
  const rawFileName = req.get("x-file-name");
  if (!rawFileName) {
    return res.status(400).json({ error: "Missing X-File-Name header" });
  }
  // Decode the file name to handle special characters
  const fileName = decodeURIComponent(rawFileName);

  const totalChunksHeader = req.get("x-total-chunks");
  if (!totalChunksHeader || isNaN(totalChunksHeader)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid X-Total-Chunks header" });
  }
  const totalChunks = Number(totalChunksHeader);

  if (totalChunks <= 0) {
    return res
      .status(400)
      .json({ error: "X-Total-Chunks must be a positive integer" });
  }

  const result = await intitFileUploadService({
    fileName: fileName,
    totalChunks: totalChunks,
  });
  console.log("Initialized upload for file:", result);
  res.status(201).json(result);
});
const uploadChunckController = catchAsync(async (req, res) => {
  const rawChunkIndex = req.params.chunkIndex;
  if (!rawChunkIndex || isNaN(rawChunkIndex)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid chunk index in URL" });
  }
  const chunkIndex = Number(rawChunkIndex);

  const rawTotalChunks = req.get("x-total-chunks");
  if (!rawTotalChunks || isNaN(rawTotalChunks)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid X-Total-Chunks header" });
  }

  const result = await uploadChunkService({
    uploadId: req.params.uploadId,
    chunkIndex: chunkIndex,
    // totalChunks: Number(req.get("x-total-chunks")),
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
    });
    const getDbResult = await getDbService();
    console.log("Current database state after merging:", getDbResult);
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
  const fileId = req.params.fileId;
  const fileData = await getFileByUploadIdService({ uploadId: fileId });
  if (!fileData) {
    return res.status(404).json({ error: "File not found" });
  }
  const { fileName } = fileData;
  const filePath = path.join(FILE_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }
  res.sendFile(filePath);
});

const getAllFiles = catchAsync(async (req, res) => {
  const files = await getDbService();
  console.log("Retrieved all files from database:", files);
  res.send(files);
});

const displayFile = catchAsync(async (req, res) => {
  const fileId = req.params.fileId;
  const fileData = await getFileByUploadIdService({ uploadId: fileId });
  if (!fileData) {
    return res.status(404).json({ error: "File not found" });
  }
  const { fileName } = fileData;
  const filePath = path.join(FILE_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }
  res.sendFile(filePath);
});

export {
  initFileUploadController,
  uploadChunckController,
  uploadStatusController,
  pauseUploadController,
  resumeUploadController,
  mergeChunksController,
  downloadFileController,
  getAllFiles,
  displayFile,
};
