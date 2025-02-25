import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AuthService from "../../../application/services/AuthService";

const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export default class AuthMiddleware {
  constructor(private authService: AuthService) {}
  public authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        res.status(401).json({ message: "Invalid token." });
        return;
      }
      const payload: JwtPayload = jwt.verify(
        token,
        ACCESS_SECRET
      ) as JwtPayload;
      if (!payload.email || !payload.version) {
        res.status(400).json({ message: "Invalid token." });
        return;
      }
      const isVerified: boolean = await this.authService.checkVerified(
        payload.email
      );
      if (!isVerified) {
        res.status(403).json({ message: "Email verification required." });
        return;
      }
      const validToken: boolean = await this.authService.checkTokenVersion(
        payload.version,
        payload.email
      );
      if (!validToken) {
        res.status(403).json({ message: "Not Authorized." });
        return;
      }
      req.user = payload;
      next();
    } catch (err) {
      res.status(400).json({ message: "Invalid token." });
    }
  };
}
