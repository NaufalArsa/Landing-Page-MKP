import { Router } from "express";
import { eq, desc, and } from "drizzle-orm";
import { db } from "../lib/db";
import { newsTable } from "@workspace/db";
import { requireAuth } from "../middleware/requireAuth";

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

router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, slug, content, imageUrl, category, status } = req.body as {
      title: string;
      slug: string;
      content?: string;
      imageUrl?: string;
      category?: string;
      status?: "draft" | "published" | "archived";
    };

    if (!title || !slug) {
      res.status(400).json({ error: "Judul dan slug wajib diisi" });
      return;
    }

    const [created] = await db
      .insert(newsTable)
      .values({
        title,
        slug,
        content: content ?? null,
        imageUrl: imageUrl ?? null,
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

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params["id"] ?? "0");
    const { title, slug, content, imageUrl, category, status } = req.body as {
      title?: string;
      slug?: string;
      content?: string;
      imageUrl?: string;
      category?: string;
      status?: "draft" | "published" | "archived";
    };

    const [existing] = await db.select().from(newsTable).where(eq(newsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Berita tidak ditemukan" });
      return;
    }

    const [updated] = await db
      .update(newsTable)
      .set({
        title: title ?? existing.title,
        slug: slug ?? existing.slug,
        content: content !== undefined ? content : existing.content,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
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
    const id = parseInt(req.params["id"] ?? "0");
    const [existing] = await db.select().from(newsTable).where(eq(newsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Berita tidak ditemukan" });
      return;
    }
    await db.delete(newsTable).where(eq(newsTable.id, id));
    res.json({ message: "Berita berhasil dihapus" });
  } catch {
    res.status(500).json({ error: "Gagal menghapus berita" });
  }
});

export default router;
