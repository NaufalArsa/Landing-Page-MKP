import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Router } from "express";
import { eq, desc, or, isNull, gte } from "drizzle-orm";
import multer from "multer";
import { db } from "../lib/db";
import { careersTable } from "@workspace/db";
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
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = Router();

// GET /api/careers - List all announcements (filtered by expiration)
router.get("/", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(careersTable)
      .where(or(isNull(careersTable.expiredAt), gte(careersTable.expiredAt, new Date())))
      .orderBy(desc(careersTable.createdAt));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data karir" });
  }
});

// GET /api/careers/:id - Get a single announcement
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params["id"] ?? "0");
    const [item] = await db.select().from(careersTable).where(eq(careersTable.id, id));
    if (!item) {
      res.status(404).json({ error: "Pengumuman karir tidak ditemukan" });
      return;
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil detail karir" });
  }
});

// POST /api/careers - Create a career announcement
router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]>;
      const coverFile = files["cover"]?.[0];
      const docFile = files["file"]?.[0];

      if (!docFile) {
        res.status(400).json({ error: "File dokumen wajib diunggah" });
        return;
      }

      const { title, expiredAt } = req.body as { title: string; expiredAt?: string };
      if (!title) {
        res.status(400).json({ error: "Judul wajib diisi" });
        return;
      }

      const coverImageUrl = coverFile ? `/api/uploads/${coverFile.filename}` : null;
      const fileUrl = `/api/uploads/${docFile.filename}`;
      const expiredAtDate = expiredAt ? new Date(expiredAt) : null;

      const [created] = await db.insert(careersTable).values({
        title,
        coverImageUrl,
        fileUrl,
        expiredAt: expiredAtDate,
        uploaderId: req.session.userId!,
      }).returning();

      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ error: "Gagal menyimpan pengumuman karir" });
    }
  }
);

// PUT /api/careers/:id - Update a career announcement
router.put(
  "/:id",
  requireAuth,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const id = parseInt((req.params["id"] as string) ?? "0");
      const [existing] = await db.select().from(careersTable).where(eq(careersTable.id, id));
      if (!existing) {
        res.status(404).json({ error: "Pengumuman karir tidak ditemukan" });
        return;
      }

      const files = req.files as Record<string, Express.Multer.File[]>;
      const coverFile = files["cover"]?.[0];
      const docFile = files["file"]?.[0];

      const { title, expiredAt } = req.body as { title?: string; expiredAt?: string };

      const coverImageUrl = coverFile ? `/api/uploads/${coverFile.filename}` : existing.coverImageUrl;
      const fileUrl = docFile ? `/api/uploads/${docFile.filename}` : existing.fileUrl;
      const expiredAtValue = expiredAt !== undefined
        ? (expiredAt ? new Date(expiredAt) : null)
        : existing.expiredAt;

      // Clean up old files if they are being replaced
      const deleteFile = (url: string | null) => {
        if (!url) return;
        const fname = url.split("/").pop();
        if (fname) {
          const fpath = path.join(UPLOADS_DIR, fname);
          if (fs.existsSync(fpath)) fs.unlinkSync(fpath);
        }
      };

      if (coverFile && existing.coverImageUrl) deleteFile(existing.coverImageUrl);
      if (docFile && existing.fileUrl) deleteFile(existing.fileUrl);

      const [updated] = await db
        .update(careersTable)
        .set({
          title: title ?? existing.title,
          coverImageUrl,
          fileUrl,
          expiredAt: expiredAtValue,
          updatedAt: new Date(),
        })
        .where(eq(careersTable.id, id))
        .returning();

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Gagal memperbarui pengumuman karir" });
    }
  }
);

// DELETE /api/careers/:id - Delete a career announcement
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt((req.params["id"] as string) ?? "0");
    const [existing] = await db.select().from(careersTable).where(eq(careersTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Pengumuman karir tidak ditemukan" });
      return;
    }

    const deleteFile = (url: string | null) => {
      if (!url) return;
      const fname = url.split("/").pop();
      if (fname) {
        const fpath = path.join(UPLOADS_DIR, fname);
        if (fs.existsSync(fpath)) fs.unlinkSync(fpath);
      }
    };

    deleteFile(existing.coverImageUrl);
    deleteFile(existing.fileUrl);

    await db.delete(careersTable).where(eq(careersTable.id, id));
    res.json({ message: "Pengumuman karir berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus pengumuman karir" });
  }
});

export default router;
