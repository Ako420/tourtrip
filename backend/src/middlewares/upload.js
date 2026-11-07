import multer from "multer";
import { HttpError } from "../utils/httpError.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 6;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES, fields: 5 },
  fileFilter: (req, file, callback) => {
    if (IMAGE_TYPES.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new HttpError(400, "Upload a JPEG, PNG or WebP image", "UPLOAD_ERROR"));
    }
  },
});

const toUploadError = (error) => {
  if (error instanceof HttpError) {
    return error;
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    return new HttpError(413, "Images must be 5 MB or smaller", "UPLOAD_ERROR");
  }

  if (error.code === "LIMIT_FILE_COUNT") {
    return new HttpError(400, `Upload up to ${MAX_FILES} images at a time`, "UPLOAD_ERROR");
  }

  // Includes broken multipart bodies, which are plain errors rather than MulterErrors.
  return new HttpError(400, "We couldn't read that upload", "UPLOAD_ERROR");
};

const receive = (parse, hasFiles) => (req, res, next) => {
  parse(req, res, (error) => {
    if (error) {
      next(toUploadError(error));
    } else if (!hasFiles(req)) {
      next(new HttpError(400, "Choose an image to upload", "UPLOAD_ERROR"));
    } else {
      next();
    }
  });
};

export const receiveImage = receive(upload.single("file"), (req) => req.file);

export const receiveImages = receive(upload.array("files", MAX_FILES), (req) => req.files?.length);
