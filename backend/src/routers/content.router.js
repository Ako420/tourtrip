import { Router } from "express";
import { getLegalDocument, getPageContent } from "../controllers/content.controller.js";
import { validate } from "../middlewares/validate.js";
import { legalParamsSchema } from "../validators/content.validator.js";

const router = Router();

router.get("/home", getPageContent("home"));
router.get("/hotels/content", getPageContent("hotels"));
router.get("/flights/content", getPageContent("flights"));
router.get("/attractions/content", getPageContent("attractions"));
router.get("/cars/content", getPageContent("cars"));
router.get("/trains/content", getPageContent("trains"));
router.get("/packages/content", getPageContent("packages"));
router.get("/planner/content", getPageContent("planner"));
router.get("/app/content", getPageContent("app"));
router.get("/legal/:slug", validate({ params: legalParamsSchema }), getLegalDocument);

export default router;
