import RefreshToken from "../../../domain/models/RefreshToken";
import RefreshTokenRepository from "../../../domain/respository/RefreshTokenRepository";
import CustomError from "../../../error/CustomError";
import InternalServerError from "../../../error/InternalServerError";
import RefreshTokenModel from "../../sequelize/models/RefreshTokenModel";
import RefreshTokenEntity from "../entities/RefreshTokenEntity";

export default class RefreshTokenRepositoryImplSequelize
  implements RefreshTokenRepository
{
  constructor() {}
  public save = async (refreshToken: RefreshToken): Promise<void> => {
    try {
      await RefreshTokenModel.create({
        userId: refreshToken.getUserId(),
        token: refreshToken.getToken(),
        expiresAt: refreshToken.getExpiresAt(),
      });
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getRefreshTokenByUserId = async (
    userId: number
  ): Promise<RefreshTokenEntity | null> => {
    try {
      const foundRefreshToken: RefreshTokenModel | null =
        await RefreshTokenModel.findOne({
          where: { userId },
        });
      if (!foundRefreshToken) {
        return null;
      }
      const refreshTokenEntity = new RefreshTokenEntity(
        foundRefreshToken.id,
        foundRefreshToken.userId,
        foundRefreshToken.token,
        foundRefreshToken.expiresAt,
        foundRefreshToken.createdAt,
        foundRefreshToken.updatedAt
      );
      return refreshTokenEntity;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getAll = async (): Promise<RefreshTokenEntity[]> => {
    try {
      const foundRefreshTokens: RefreshTokenModel[] =
        await RefreshTokenModel.findAll();
      const refreshTokens: RefreshTokenEntity[] = [];
      if (!foundRefreshTokens) return refreshTokens;
      foundRefreshTokens.forEach((e: RefreshTokenModel) => {
        const token = new RefreshTokenEntity(
          e?.id,
          e?.userId,
          e?.token,
          e?.expiresAt,
          e?.createdAt,
          e?.updatedAt
        );
        refreshTokens.push(token);
      });
      return refreshTokens;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public update = async (
    token: string,
    refreshToken: RefreshToken
  ): Promise<void> => {
    try {
      const [updatedRows] = await RefreshTokenModel.update(refreshToken, {
        where: { token },
      });
      if (updatedRows === 0) {
        throw new CustomError("Update operation did not complete.", 500);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public delete = async (userId: number): Promise<void> => {
    try {
      const rowCount = await RefreshTokenModel.destroy({ where: { userId } });
      if (rowCount === 0) {
        throw new CustomError("Delete operation did not complete.", 500);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };
}
