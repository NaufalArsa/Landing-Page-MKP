import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Router } from "express";
import { desc } from "drizzle-orm";
import multer from "multer";
import { db } from "../lib/db";
import { orgStructureTable } from "@workspace/db";
import { requireAuth } from "../middleware/requireAuth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `org-structure-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const [latest] = await db
      .select()
      .from(orgStructureTable)
      .orderBy(desc(orgStructureTable.updatedAt))
      .limit(1);
    res.json(latest ?? null);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data struktur organisasi" });
  }
});

router.post(
  "/",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) { res.status(400).json({ error: "Gambar wajib diunggah" }); return; }

      // Delete old image if exists
      const [existing] = await db.select().from(orgStructureTable).limit(1);
      if (existing) {
        const fname = existing.imageUrl.split("/").pop();
        if (fname) {
          const fpath = path.join(UPLOADS_DIR, fname);
          if (fs.existsSync(fpath)) fs.unlinkSync(fpath);
        }
        await db.delete(orgStructureTable);
      }

      const imageUrl = `/api/uploads/${file.filename}`;
      const [created] = await db.insert(orgStructureTable).values({
        imageUrl,
        uploaderId: req.session.userId!,
      }).returning();

      res.status(201).json(created);
    } catch {
      res.status(500).json({ error: "Gagal menyimpan struktur organisasi" });
    }
  }
);

export default router;
