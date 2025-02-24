import { Request, Response } from "express";
import AuthService from "../../../application/services/AuthService";
import CustomError from "../../../error/CustomError";
import RefreshTokenService from "../../../application/services/RefreshTokenService";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import RefreshTokenEntity from "../../persistence/entities/RefreshTokenEntity";
import AccessTokenService from "../../../application/services/AccessTokenService";
import bcrypt from "bcrypt";
import { createEmail, Email } from "../../../lib/utils/createEmail";

const REFRESH_SECRET: Secret = process.env.REFRESH_SECRET!;

export default class AuthController {
  constructor(
    private authService: AuthService,
    private refreshTokenService: RefreshTokenService,
    private accessTokenService: AccessTokenService
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
    const userId = req.user?.sub;
    try {
      await this.authService.logout(userId);
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
    const userId = req.user?.sub;
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
        res.status(400).json({ message: "Missing refresh token." });
        return;
      }
      const decodedRefreshToken: JwtPayload = jwt.verify(
        refreshToken,
        REFRESH_SECRET
      ) as JwtPayload;
      const userId = Number(decodedRefreshToken.sub);
      if (!userId || userId === undefined) {
        res.status(400).json({ message: "Refresh token is invalid." });
        return;
      }
      const foundRefreshTokenEntity: RefreshTokenEntity =
        await this.refreshTokenService.findEntryByUserId(userId);
      if (!foundRefreshTokenEntity) {
        res.status(401).json({ message: "Refresh token is invalid." });
        return;
      }
      if (typeof decodedRefreshToken === "string") {
        res.status(401).json({ message: "Invalid token." });
        return;
      }
      const storedRefreshToken = foundRefreshTokenEntity.getToken();
      const matches = await bcrypt.compare(refreshToken, storedRefreshToken);
      if (matches) {
        const newRefreshToken =
          await this.refreshTokenService.issueNewRefreshToken(userId);
        if (!newRefreshToken) {
          res.status(500).json({ message: "Internal server error." });
          return;
        }
        const newAccessToken: string =
          await this.accessTokenService.createAccessTokenStringFromRefreshTokenString(
            newRefreshToken
          );
        if (!newAccessToken) {
          res.status(500).json({ message: "Internal server error." });
          return;
        }
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, //24h
        });
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 1000, //1h
        });
        res.status(200).json({ message: "Access token refreshed." });
      } else {
        res.status(403).json({ message: "Invalid token." });
      }
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };
}
