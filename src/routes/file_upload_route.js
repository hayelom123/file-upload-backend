import express from "express";
import * as fileController from "../controllers/file-upload-controller.js";

const router = express.Router();
const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

router.post(
  "/upload/:uploadId/chunk/:chunkIndex",
  (req, res, next) => {
    // check content-length header
    const contentLength = req.headers["content-length"];
    if (!contentLength || parseInt(contentLength, 10) <= 0) {
      return res
        .status(400)
        .json({ error: "Missing or invalid Content-Length header" });
    }
    const size = parseInt(contentLength, 10);

    if (size > MAX_CHUNK_SIZE) {
      return res.status(413).json({
        message: "Chunk too large",
      });
    }
    console.log(
      `Received chunk ${req.params.chunkIndex} of size ${size} bytes for upload ID ${req.params.uploadId}.`,
    );
    // check x-total-chunks header
    const totalChunks = req.headers["x-total-chunks"];
    if (!totalChunks || parseInt(totalChunks, 10) <= 0) {
      return res
        .status(400)
        .json({ error: "Missing or invalid X-Total-Chunks header" });
    }
    const total = parseInt(totalChunks, 10);
    // check x-file-name header
    const fileName = req.headers["x-file-name"];
    if (!fileName) {
      return res.status(400).json({ error: "Missing X-File-Name header" });
    }

    next();
  },

  fileController.uploadChunckController,
);

router.post("/upload", fileController.initFileUploadController);
router.post("/upload/pause", fileController.pauseUploadController);
router.post("/upload/resume", fileController.resumeUploadController);
router.post("/upload/merge", fileController.mergeChunksController);
router.get("/download/:fileId", fileController.downloadFileController);
router.get("/upload/status/:uploadId", fileController.uploadStatusController);

export default router;
