const db = {};
const getDb = () => db;

const resetDb = () => {
  for (const key in db) {
    delete db[key];
  }
};

const setDb = (newDb) => {
  resetDb();
  Object.assign(db, newDb);
};

const insertToDb = ({ fileName, totalChunks }) => {
  const uploadId = crypto.randomUUID(); // Generate a unique upload ID based on timestamp
  db[uploadId] = {
    fileName,
    totalChunks,
    completed: false,
    receivedChunks: 0,
  };
  return uploadId;
};

const getFileByUploadId = (uploadId) => {
  return db[uploadId] || null;
};

const deleteFromDb = (uploadId) => {
  delete db[uploadId];
};

const updateDb = (uploadId, status) => {
  if (db[uploadId]) {
    db[uploadId] = { ...db[uploadId], ...status };
  } else {
    db[uploadId] = status;
  }
};

const getUploadStatus = (uploadId) => {
  return (
    db[uploadId] || {
      completed: false,
      receivedChunks: 0,
      error: "Upload ID not found",
    }
  );
};

const updateUploadStatus = (uploadId, status) => {
  db[uploadId] = status;
};
const updateUploadProgress = (uploadId, receivedChunks) => {
  if (db[uploadId]) {
    db[uploadId].receivedChunks = receivedChunks;
    if (receivedChunks >= db[uploadId].totalChunks) {
      db[uploadId].completed = true;
    }
  }
  return (
    db[uploadId] || {
      completed: false,
      receivedChunks: 0,
      error: "Upload ID not found",
    }
  );
};

export {
  insertToDb,
  getFileByUploadId,
  deleteFromDb,
  updateDb,
  updateUploadStatus,
  getDb,
  getUploadStatus,
  updateUploadProgress,
};
