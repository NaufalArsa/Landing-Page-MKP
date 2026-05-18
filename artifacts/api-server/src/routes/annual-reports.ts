import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import multer from "multer";
import { db } from "../lib/db";
import { annualReportsTable } from "@workspace/db";
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
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40);
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

router.get("/", async (req, res) => {
  try {
    const reports = await db
      .select()
      .from(annualReportsTable)
      .orderBy(desc(annualReportsTable.year));
    res.json(reports);
  } catch {
    res.status(500).json({ error: "Gagal mengambil laporan tahunan" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params["id"] ?? "0");
    const [item] = await db.select().from(annualReportsTable).where(eq(annualReportsTable.id, id));
    if (!item) { res.status(404).json({ error: "Laporan tidak ditemukan" }); return; }
    res.json(item);
  } catch {
    res.status(500).json({ error: "Gagal mengambil laporan" });
  }
});

router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]>;
      const pdfFile = files["pdf"]?.[0];
      const coverFile = files["cover"]?.[0];

      if (!pdfFile) { res.status(400).json({ error: "File PDF wajib diunggah" }); return; }

      const { year, title, description } = req.body as {
        year: string; title: string; description?: string;
      };
      if (!year || !title) { res.status(400).json({ error: "Tahun dan judul wajib diisi" }); return; }

      const pdfUrl = `/api/uploads/${pdfFile.filename}`;
      const coverImageUrl = coverFile ? `/api/uploads/${coverFile.filename}` : null;

      const [created] = await db.insert(annualReportsTable).values({
        year: parseInt(year),
        title,
        description: description ?? null,
        pdfUrl,
        coverImageUrl,
        uploaderId: req.session.userId!,
      }).returning();

      res.status(201).json(created);
    } catch {
      res.status(500).json({ error: "Gagal menyimpan laporan tahunan" });
    }
  }
);

router.put(
  "/:id",
  requireAuth,
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const id = parseInt(req.params["id"] ?? "0");
      const [existing] = await db.select().from(annualReportsTable).where(eq(annualReportsTable.id, id));
      if (!existing) { res.status(404).json({ error: "Laporan tidak ditemukan" }); return; }

      const files = req.files as Record<string, Express.Multer.File[]>;
      const pdfFile = files["pdf"]?.[0];
      const coverFile = files["cover"]?.[0];

      const { year, title, description } = req.body as {
        year?: string; title?: string; description?: string;
      };

      const pdfUrl = pdfFile ? `/api/uploads/${pdfFile.filename}` : existing.pdfUrl;
      const coverImageUrl = coverFile ? `/api/uploads/${coverFile.filename}` : existing.coverImageUrl;

      const [updated] = await db
        .update(annualReportsTable)
        .set({
          year: year ? parseInt(year) : existing.year,
          title: title ?? existing.title,
          description: description !== undefined ? description : existing.description,
          pdfUrl,
          coverImageUrl,
          updatedAt: new Date(),
        })
        .where(eq(annualReportsTable.id, id))
        .returning();

      res.json(updated);
    } catch {
      res.status(500).json({ error: "Gagal memperbarui laporan" });
    }
  }
);

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params["id"] ?? "0");
    const [existing] = await db.select().from(annualReportsTable).where(eq(annualReportsTable.id, id));
    if (!existing) { res.status(404).json({ error: "Laporan tidak ditemukan" }); return; }

    const deleteFile = (url: string | null) => {
      if (!url) return;
      const fname = url.split("/").pop();
      if (fname) {
        const fpath = path.join(UPLOADS_DIR, fname);
        if (fs.existsSync(fpath)) fs.unlinkSync(fpath);
      }
    };
    deleteFile(existing.pdfUrl);
    deleteFile(existing.coverImageUrl);

    await db.delete(annualReportsTable).where(eq(annualReportsTable.id, id));
    res.json({ message: "Laporan berhasil dihapus" });
  } catch {
    res.status(500).json({ error: "Gagal menghapus laporan" });
  }
});

export default router;
