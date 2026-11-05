import { Router } from "express";
import { createUpload, deleteUpload, getUploads } from "../controllers/upload.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";
import { receiveImage } from "../middlewares/upload.js";
import { validate } from "../middlewares/validate.js";
import { listUploadsSchema, uploadParamsSchema, uploadSchema } from "../validators/upload.validator.js";

const router = Router();

router.use(requireAuth, requireAdmin);

// The form's text fields are only readable once receiveImage has parsed the request.
router.post("/uploads", receiveImage, validate({ body: uploadSchema }), createUpload);
router.get("/uploads", validate({ query: listUploadsSchema }), getUploads);
router.delete("/uploads/:id", validate({ params: uploadParamsSchema }), deleteUpload);

export default router;
