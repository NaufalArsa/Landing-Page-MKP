import { Router } from "express";
import { eq, desc, and } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import multer from "multer";
import { db } from "../lib/db";
import { newsTable } from "@workspace/db";
import { requireAuth } from "../middleware/requireAuth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype));
  },
});

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const conditions = status && typeof status === "string"
      ? [eq(newsTable.status, status as "draft" | "published" | "archived")]
      : [];

    const news = await db
      .select()
      .from(newsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(newsTable.createdAt));

    res.json(news);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data berita" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params["id"] ?? "0");
    const [item] = await db.select().from(newsTable).where(eq(newsTable.id, id));
    if (!item) {
      res.status(404).json({ error: "Berita tidak ditemukan" });
      return;
    }
    res.json(item);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data berita" });
  }
});

router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, slug, content, category, status } = req.body as {
      title: string;
      slug: string;
      content?: string;
      category?: string;
      status?: "draft" | "published" | "archived";
    };

    if (!title || !slug) {
      res.status(400).json({ error: "Judul dan slug wajib diisi" });
      return;
    }

    const imageUrl = req.file ? `/api/uploads/${req.file.filename}` : null;

    const [created] = await db
      .insert(newsTable)
      .values({
        title,
        slug,
        content: content ?? null,
        imageUrl,
        category: category ?? null,
        status: status ?? "draft",
        uploaderId: req.session.userId!,
        publishedAt: status === "published" ? new Date() : null,
      })
      .returning();

    res.status(201).json(created);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("unique")) {
      res.status(409).json({ error: "Slug sudah digunakan" });
    } else {
      res.status(500).json({ error: "Gagal membuat berita" });
    }
  }
});

router.put("/:id", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const id = parseInt((req.params["id"] as string) ?? "0");
    const { title, slug, content, category, status } = req.body as {
      title?: string;
      slug?: string;
      content?: string;
      category?: string;
      status?: "draft" | "published" | "archived";
    };

    const [existing] = await db.select().from(newsTable).where(eq(newsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Berita tidak ditemukan" });
      return;
    }

    const imageUrl = req.file ? `/api/uploads/${req.file.filename}` : existing.imageUrl;

    const [updated] = await db
      .update(newsTable)
      .set({
        title: title ?? existing.title,
        slug: slug ?? existing.slug,
        content: content !== undefined ? content : existing.content,
        imageUrl,
        category: category !== undefined ? category : existing.category,
        status: status ?? existing.status,
        publishedAt:
          status === "published" && !existing.publishedAt ? new Date() : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(newsTable.id, id))
      .returning();

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Gagal memperbarui berita" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt((req.params["id"] as string) ?? "0");
    const [existing] = await db.select().from(newsTable).where(eq(newsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Berita tidak ditemukan" });
      return;
    }
    
    if (existing.imageUrl) {
      const filename = existing.imageUrl.split("/").pop();
      if (filename) {
        const filePath = path.join(UPLOADS_DIR, filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }

    await db.delete(newsTable).where(eq(newsTable.id, id));
    res.json({ message: "Berita berhasil dihapus" });
  } catch {
    res.status(500).json({ error: "Gagal menghapus berita" });
  }
});

export default router;
