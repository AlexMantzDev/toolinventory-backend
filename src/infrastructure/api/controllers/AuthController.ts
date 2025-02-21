import { Request, Response } from "express";
import AuthService from "../../../application/services/AuthService";
import CustomError from "../../../error/CustomError";
import { TokenService } from "../../../application/services/TokenService";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const REFRESH_SECRET: Secret = process.env.REFRESH_SECRET!;
const ACCESS_SECRET: Secret = process.env.ACCESS_SECRET!;
const VERIFY_SECRET: Secret = process.env.VERIFY_SECRET!;

interface Payload extends JwtPayload {
  sub: string;
  email: string;
}

export default class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        email,
        password
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, //1h
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days
      });
      res.status(200).json({ message: "login successful." });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
      await this.authService.register({
        email,
        password,
      });
      res.status(201).json({ message: "User registration successful." });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    try {
      this.authService.logout(refreshToken);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logged out successfully." });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const { user } = req.body;
    const userId = req.user?.id;
    try {
      await this.authService.update(userId, user);
      res.status(200).json({ message: "User has been updated." });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public verifyUser = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;
    if (!token) {
      res.status(400).json({ message: "Verification token is required." });
      return;
    }
    try {
      await this.authService.verify(token.toString());
      res.status(200).json({ message: "User verification was a success." });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    try {
      if (!refreshToken) {
        res.status(400).json({ error: "Missing refresh token." });
        return;
      }
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as Payload;
      const stored = await this.tokenService.findByToken(refreshToken);
      if (!stored) {
        res.status(401).json({ error: "Refresh token is invalid." });
        return;
      }
      if (typeof decoded === "string") {
        res.status(401).json({ error: "Invalid token type." });
      }
      const newAccessToken = jwt.sign(
        {
          sub: decoded.sub,
          email: decoded.email,
        },
        ACCESS_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, //1h
      });
      res.status(200).json({ message: "Access token refreshed." });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };
}
