import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Router } from "express";
import { eq, asc } from "drizzle-orm";
import multer from "multer";
import { db } from "../lib/db";
import { boardMembersTable } from "@workspace/db";
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
      .slice(0, 30);
    cb(null, `member-${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = Router();

router.get("/", async (req, res) => {
  try {
    const type = req.query["type"] as string | undefined;
    const query = db.select().from(boardMembersTable).orderBy(asc(boardMembersTable.orderIndex));
    const members = type
      ? await db.select().from(boardMembersTable).where(eq(boardMembersTable.type, type)).orderBy(asc(boardMembersTable.orderIndex))
      : await query;
    res.json(members);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data anggota" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params["id"] ?? "0");
    const [member] = await db.select().from(boardMembersTable).where(eq(boardMembersTable.id, id));
    if (!member) { res.status(404).json({ error: "Anggota tidak ditemukan" }); return; }
    res.json(member);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data anggota" });
  }
});

router.post(
  "/",
  requireAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) { res.status(400).json({ error: "Foto wajib diunggah" }); return; }

      const { name, position, type, orderIndex } = req.body as {
        name: string; position?: string; type: string; orderIndex?: string;
      };
      if (!name || !type) { res.status(400).json({ error: "Nama dan tipe wajib diisi" }); return; }
      if (!["direksi", "komisaris"].includes(type)) {
        res.status(400).json({ error: "Tipe harus 'direksi' atau 'komisaris'" }); return;
      }

      const photoUrl = `/api/uploads/${file.filename}`;
      const [created] = await db.insert(boardMembersTable).values({
        name,
        position: position ?? null,
        photoUrl,
        type,
        orderIndex: orderIndex ? parseInt(orderIndex) : 0,
        uploaderId: req.session.userId!,
      }).returning();

      res.status(201).json(created);
    } catch {
      res.status(500).json({ error: "Gagal menyimpan data anggota" });
    }
  }
);

router.put(
  "/:id",
  requireAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      const id = parseInt((req.params["id"] as string) ?? "0");
      const [existing] = await db.select().from(boardMembersTable).where(eq(boardMembersTable.id, id));
      if (!existing) { res.status(404).json({ error: "Anggota tidak ditemukan" }); return; }

      const file = req.file;
      const { name, position, type, orderIndex } = req.body as {
        name?: string; position?: string; type?: string; orderIndex?: string;
      };

      // Delete old photo if new one uploaded
      if (file) {
        const fname = existing.photoUrl.split("/").pop();
        if (fname) {
          const fpath = path.join(UPLOADS_DIR, fname);
          if (fs.existsSync(fpath)) fs.unlinkSync(fpath);
        }
      }

      const photoUrl = file ? `/api/uploads/${file.filename}` : existing.photoUrl;

      const [updated] = await db
        .update(boardMembersTable)
        .set({
          name: name ?? existing.name,
          position: position !== undefined ? (position || null) : existing.position,
          photoUrl,
          type: type ?? existing.type,
          orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : existing.orderIndex,
          updatedAt: new Date(),
        })
        .where(eq(boardMembersTable.id, id))
        .returning();

      res.json(updated);
    } catch {
      res.status(500).json({ error: "Gagal memperbarui data anggota" });
    }
  }
);

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt((req.params["id"] as string) ?? "0");
    const [existing] = await db.select().from(boardMembersTable).where(eq(boardMembersTable.id, id));
    if (!existing) { res.status(404).json({ error: "Anggota tidak ditemukan" }); return; }

    const fname = existing.photoUrl.split("/").pop();
    if (fname) {
      const fpath = path.join(UPLOADS_DIR, fname);
      if (fs.existsSync(fpath)) fs.unlinkSync(fpath);
    }

    await db.delete(boardMembersTable).where(eq(boardMembersTable.id, id));
    res.json({ message: "Anggota berhasil dihapus" });
  } catch {
    res.status(500).json({ error: "Gagal menghapus anggota" });
  }
});

export default router;
