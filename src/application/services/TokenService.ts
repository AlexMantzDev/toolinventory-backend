import RefreshToken from "../../domain/models/RefreshToken";
import CustomError from "../../error/CustomError";
import InternalServerError from "../../error/InternalServerError";
import NotFoundError from "../../error/NotFoundError";
import RefreshTokenEntity from "../../infrastructure/persistence/entities/RefreshTokenEntity";
import RefreshTokenRepositoryImplSequelize from "../../infrastructure/persistence/repository-impls/RefreshTokenRepositoryImplSequelize";
import RefreshTokenDTO from "../dtos/RefreshTokenDTO";

export class TokenService {
  constructor(
    private refreshTokenRepository: RefreshTokenRepositoryImplSequelize
  ) {}
  public create = async (dto: RefreshTokenDTO): Promise<void> => {
    try {
      const refreshToken = new RefreshToken(
        dto.userId,
        dto.token,
        dto.expiresAt
      );
      await this.refreshTokenRepository.save(refreshToken);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public update = async (
    token: string,
    dto: RefreshTokenDTO
  ): Promise<void> => {
    try {
      const refreshToken = new RefreshToken(
        dto.userId,
        dto.token,
        dto.expiresAt
      );
      await this.refreshTokenRepository.update(token, refreshToken);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public delete = async (token: string): Promise<void> => {
    try {
      await this.refreshTokenRepository.delete(token);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public findByToken = async (token: string): Promise<RefreshTokenEntity> => {
    try {
      const refreshToken = await this.refreshTokenRepository.getByTokenString(
        token
      );
      if (!refreshToken) {
        throw new NotFoundError(
          "Could not find refresh token with string provided."
        );
      }
      return refreshToken;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public findAll = async (): Promise<RefreshTokenEntity[]> => {
    try {
      return await this.refreshTokenRepository.getAll();
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };
}
