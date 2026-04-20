import type { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const session = (req as Request & { session: { userId?: number; userRole?: string } }).session;
  if (!session?.userId) {
    res.status(401).json({ error: "Tidak terautentikasi" });
    return;
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const session = (req as Request & { session: { userId?: number; userRole?: string } }).session;
    if (!session?.userId) {
      res.status(401).json({ error: "Tidak terautentikasi" });
      return;
    }
    if (!roles.includes(session.userRole ?? "")) {
      res.status(403).json({ error: "Akses ditolak" });
      return;
    }
    next();
  };
}
