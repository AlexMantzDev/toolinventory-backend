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

  public me = async (req: Request, res: Response): Promise<void> => {
    const user = req.user;
    try {
      res.status(200).json({ user });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        createEmail(email),
        password
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, //15min
        path: "/",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1 * 24 * 60 * 60 * 1000, //1days
        path: "/",
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
        email: createEmail(email),
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

  public resendVerifyLink = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email } = req.body;
    try {
      await this.authService.resendVerifyLink(createEmail(email));
      res
        .status(200)
        .json({ message: "Verification link was resent to user email." });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    const { sub: userId } = req.user;
    try {
      await this.authService.logout(userId);
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
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
    const { email } = req.user;
    try {
      await this.authService.update(createEmail(email), user);
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

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }
    try {
      const validEmail: Email = createEmail(email);
      await this.authService.sendResetLink(validEmail);
      res.status(200).json({ message: "Check email for password reset link." });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public changePassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { password } = req.body;
    const { token } = req.query;
    if (!password) {
      res.status(400).json({ message: "Password is required." });
      return;
    }
    if (!token) {
      res.status(401).json({ message: "Not authorized." });
      return;
    }
    try {
      await this.authService.resetPassword(token.toString(), password);
      res.status(200).json({ message: "Password changed." });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.cookies;
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
      if (!userId) {
        res.status(400).json({ message: "Refresh token is invalid." });
        return;
      }
      const foundRefreshTokenEntity: RefreshTokenEntity =
        await this.refreshTokenService.findEntryByUserId(userId);
      if (!foundRefreshTokenEntity) {
        res.status(400).json({ message: "Refresh token is invalid." });
        return;
      }
      const savedToken = foundRefreshTokenEntity.getToken();
      const matches = await bcrypt.compare(refreshToken, savedToken);
      if (!matches) {
        res.status(400).json({ message: "Refresh token is invalid." });
        return;
      }
      const newRefreshToken =
        await this.refreshTokenService.issueNewRefreshToken(userId);
      if (!newRefreshToken) {
        res
          .status(500)
          .json({ message: "Error generating new refresh token." });
        return;
      }
      const newAccessToken: string =
        await this.accessTokenService.refreshAccessToken(newRefreshToken);
      if (!newAccessToken) {
        res.status(500).json({ message: "Error generating new access token" });
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
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public denyUser = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const { role } = req.user;
    if (role !== "admin") {
      res.status(403).json({ message: "Not authorized." });
      return;
    }
    if (!email) {
      res.status(400).json({ message: "Invalid email." });
      return;
    }
    try {
      await this.authService.denyUser(createEmail(email));
      res.status(200).json({ message: "User set to not allowed." });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public permitUser = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const { role } = req.user;
    if (role !== "admin") {
      res.status(403).json({ message: "Not authorized." });
      return;
    }
    if (!email) {
      res.status(400).json({ message: "Invalid email." });
      return;
    }
    try {
      await this.authService.permitUser(createEmail(email));
      res.status(200).json({ message: "User set to allowed." });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };
}
