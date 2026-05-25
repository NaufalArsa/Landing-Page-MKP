import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import multer from "multer";
import { db } from "../lib/db";
import { directorDecreesTable } from "@workspace/db";
import { requireAuth } from "../middleware/requireAuth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext)
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const decrees = await db.select().from(directorDecreesTable).orderBy(desc(directorDecreesTable.createdAt));
    res.json(decrees);
  } catch { res.status(500).json({ error: "Gagal mengambil data" }); }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params["id"] ?? "0");
    const [item] = await db.select().from(directorDecreesTable).where(eq(directorDecreesTable.id, id));
    if (!item) { res.status(404).json({ error: "Tidak ditemukan" }); return; }
    res.json(item);
  } catch { res.status(500).json({ error: "Gagal mengambil data" }); }
});

router.post("/", requireAuth,
  upload.fields([{ name: "pdf", maxCount: 1 }, { name: "cover", maxCount: 1 }]),
  async (req, res) => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]>;
      const pdfFile = files["pdf"]?.[0];
      const coverFile = files["cover"]?.[0];
      if (!pdfFile) { res.status(400).json({ error: "File PDF wajib diunggah" }); return; }
      const { number, title, description, effectiveDate } = req.body as {
        number: string; title: string; description?: string; effectiveDate?: string;
      };
      if (!number || !title) { res.status(400).json({ error: "Nomor dan judul wajib diisi" }); return; }
      const [created] = await db.insert(directorDecreesTable).values({
        number, title,
        description: description ?? null,
        effectiveDate: effectiveDate ?? null,
        pdfUrl: `/api/uploads/${pdfFile.filename}`,
        coverImageUrl: coverFile ? `/api/uploads/${coverFile.filename}` : null,
        uploaderId: req.session.userId!,
      }).returning();
      res.status(201).json(created);
    } catch { res.status(500).json({ error: "Gagal menyimpan data" }); }
  }
);

router.put("/:id", requireAuth,
  upload.fields([{ name: "pdf", maxCount: 1 }, { name: "cover", maxCount: 1 }]),
  async (req, res) => {
    try {
      const id = parseInt((req.params["id"] as string) ?? "0");
      const [existing] = await db.select().from(directorDecreesTable).where(eq(directorDecreesTable.id, id));
      if (!existing) { res.status(404).json({ error: "Tidak ditemukan" }); return; }
      const files = req.files as Record<string, Express.Multer.File[]>;
      const pdfFile = files["pdf"]?.[0];
      const coverFile = files["cover"]?.[0];
      const { number, title, description, effectiveDate } = req.body as {
        number?: string; title?: string; description?: string; effectiveDate?: string;
      };
      const [updated] = await db.update(directorDecreesTable).set({
        number: number ?? existing.number,
        title: title ?? existing.title,
        description: description !== undefined ? description : existing.description,
        effectiveDate: effectiveDate !== undefined ? effectiveDate : existing.effectiveDate,
        pdfUrl: pdfFile ? `/api/uploads/${pdfFile.filename}` : existing.pdfUrl,
        coverImageUrl: coverFile ? `/api/uploads/${coverFile.filename}` : existing.coverImageUrl,
        updatedAt: new Date(),
      }).where(eq(directorDecreesTable.id, id)).returning();
      res.json(updated);
    } catch { res.status(500).json({ error: "Gagal memperbarui data" }); }
  }
);

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt((req.params["id"] as string) ?? "0");
    const [existing] = await db.select().from(directorDecreesTable).where(eq(directorDecreesTable.id, id));
    if (!existing) { res.status(404).json({ error: "Tidak ditemukan" }); return; }
    const del = (url: string | null) => { if (url) { const f = path.join(UPLOADS_DIR, url.split("/").pop()!); if (fs.existsSync(f)) fs.unlinkSync(f); } };
    del(existing.pdfUrl); del(existing.coverImageUrl);
    await db.delete(directorDecreesTable).where(eq(directorDecreesTable.id, id));
    res.json({ message: "Berhasil dihapus" });
  } catch { res.status(500).json({ error: "Gagal menghapus data" }); }
});

export default router;
