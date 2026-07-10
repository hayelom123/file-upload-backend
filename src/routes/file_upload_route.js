import express from "express";
import * as fileController from "../controllers/file-upload-controller.js";

const router = express.Router();

router.post("/upload", fileController.initFileUploadController);
router.post("/upload/chunk", fileController.uploadChunckController);
router.post("/upload/pause", fileController.pauseUploadController);
router.post("/upload/resume", fileController.resumeUploadController);
router.post("/upload/merge", fileController.mergeChunksController);
router.get("/download/:fileId", fileController.downloadFileController);
router.get("/upload/status/:uploadId", fileController.uploadStatusController);

export default router;
