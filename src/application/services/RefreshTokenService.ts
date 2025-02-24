import RefreshToken from "../../domain/models/RefreshToken";
import NotFoundError from "../../error/NotFoundError";
import RefreshTokenEntity from "../../infrastructure/persistence/entities/RefreshTokenEntity";
import RefreshTokenRepositoryImplSequelize from "../../infrastructure/persistence/repository-impls/RefreshTokenRepositoryImplSequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { throwErrs } from "../../lib/utils/throwErrs";

const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export default class RefreshTokenService {
  constructor(
    private refreshTokenRepository: RefreshTokenRepositoryImplSequelize
  ) {}

  private createRefreshTokenString = (userId: number) => {
    const refreshTokenString = jwt.sign(
      {
        sub: userId,
        iat: Date.now(),
        scope: "refresh_token",
      },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    return refreshTokenString;
  };

  public issueNewRefreshToken = async (userId: number): Promise<string> => {
    try {
      const oldToken: RefreshTokenEntity | null =
        await this.refreshTokenRepository.getRefreshTokenByUserId(userId);
      const exp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const token = this.createRefreshTokenString(userId);
      const saltRounds = 10;
      const hashedToken = await bcrypt.hash(token, saltRounds);
      const refreshToken = new RefreshToken(userId, hashedToken, exp);
      if (oldToken) {
        this.refreshTokenRepository.update(oldToken.getToken(), refreshToken);
      } else {
        await this.refreshTokenRepository.save(refreshToken);
      }
      return token;
    } catch (err) {
      throwErrs(err);
    }
  };

  public deleteRefreshTokenEntry = async (userId: number): Promise<void> => {
    try {
      await this.refreshTokenRepository.delete(userId);
    } catch (err) {
      throwErrs(err);
    }
  };

  public findAllEntries = async (): Promise<RefreshTokenEntity[]> => {
    try {
      return await this.refreshTokenRepository.getAll();
    } catch (err) {
      throwErrs(err);
    }
  };

  public findEntryByUserId = async (
    userId: number
  ): Promise<RefreshTokenEntity> => {
    try {
      const foundRefreshToken =
        await this.refreshTokenRepository.getRefreshTokenByUserId(userId);
      if (!foundRefreshToken) {
        throw new NotFoundError(
          "Could not find refresh token with user id: " + userId
        );
      }
      return foundRefreshToken;
    } catch (err) {
      throwErrs(err);
    }
  };
}
