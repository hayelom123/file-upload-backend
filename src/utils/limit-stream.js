import { Transform } from "stream";

export class LimitStream extends Transform {
  constructor(maxSize) {
    super();
    this.maxSize = maxSize;
    this.bytesReceived = 0;
  }

  _transform(chunk, encoding, callback) {
    this.bytesReceived += chunk.length;

    if (this.bytesReceived > this.maxSize) {
      callback(new Error("Chunk size exceeded limit"));
      return;
    }

    callback(null, chunk);
  }
}
