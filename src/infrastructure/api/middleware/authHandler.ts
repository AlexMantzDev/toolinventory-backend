import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(401).json({ error: "No token." });
    return;
  }
  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid/expired token." });
    return;
  }
}
