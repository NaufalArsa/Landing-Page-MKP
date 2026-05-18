import { Router, type IRouter } from "express";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import newsRouter from "./news";
import annualReportsRouter from "./annual-reports";
import gratificationReportsRouter from "./gratification-reports";
import directorDecreesRouter from "./director-decrees";
import pengadaanRouter from "./pengadaan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

const router: IRouter = Router();

router.use("/uploads", express.static(UPLOADS_DIR));
router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/news", newsRouter);
router.use("/annual-reports", annualReportsRouter);
router.use("/gratification-reports", gratificationReportsRouter);
router.use("/director-decrees", directorDecreesRouter);
router.use("/pengadaan", pengadaanRouter);

export default router;
