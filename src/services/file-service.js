import { CHUNK_DIR, FILE_DIR } from "../controllers/constants.js";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

// limit the size of the chunk being uploaded to 5MB
import { LimitStream } from "../utils/limit-stream.js";
const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

const uploadChunkService = async ({
  uploadId,
  totalChunks,
  chunkIndex,
  stream,
}) => {
  // Ensure the directory for this uploadId exists
  const uploadDir = path.join(CHUNK_DIR, uploadId);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const chunkPath = path.join(uploadDir, `${chunkIndex}.part`);

  // await fs.promises.writeFile(chunkPath, buffer);
  // await pipeline(stream, fs.createWriteStream(chunkPath));
  const limiter = new LimitStream(MAX_CHUNK_SIZE);
  await pipeline(stream, limiter, fs.createWriteStream(chunkPath));

  // Check if all chunks have been uploaded
  const completed = totalChunks - 1 === chunkIndex;

  return {
    success: true,
    completed,
  };
};

const mergeChunksService = async ({ uploadId, fileName, totalChunks }) => {
  const uploadDir = path.join(CHUNK_DIR, uploadId);

  await fs.promises.access(uploadDir);

  await fs.promises.mkdir(FILE_DIR, {
    recursive: true,
  });

  const finalPath = path.join(FILE_DIR, fileName);

  await fs.promises.rm(finalPath, {
    force: true,
  });

  const writeStream = fs.createWriteStream(finalPath);

  try {
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(uploadDir, `${i}.part`);

      await fs.promises.access(chunkPath);

      const readStream = fs.createReadStream(chunkPath);

      await new Promise((resolve, reject) => {
        readStream.pipe(writeStream, {
          end: false,
        });

        readStream.on("end", resolve);
        readStream.on("error", reject);
      });
    }

    await new Promise((resolve, reject) => {
      writeStream.end(resolve);

      writeStream.on("error", reject);
    });

    await fs.promises.rm(uploadDir, {
      recursive: true,
      force: true,
    });

    return {
      success: true,
      filePath: finalPath,
      completed: true,
    };
  } catch (err) {
    writeStream.destroy();
    throw err;
  }
};
export { uploadChunkService, mergeChunksService };
