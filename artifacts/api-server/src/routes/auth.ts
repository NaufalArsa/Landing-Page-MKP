import { Router } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { usersTable } from "@workspace/db";

declare module "express-session" {
  interface SessionData {
    userId: number;
    userRole: string;
    displayName: string;
    username: string;
  }
}

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body as { username: string; password: string };

    if (!username || !password) {
      res.status(400).json({ error: "Username dan password wajib diisi" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));

    if (!user) {
      res.status(401).json({ error: "Username atau password salah" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Username atau password salah" });
      return;
    }

    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.displayName = user.displayName;
    req.session.username = user.username;

    res.json({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Berhasil keluar" });
  });
});

router.get("/me", (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Tidak terautentikasi" });
    return;
  }
  res.json({
    id: req.session.userId,
    username: req.session.username,
    displayName: req.session.displayName,
    role: req.session.userRole,
  });
});

export default router;
