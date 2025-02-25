import RefreshToken from "../../../domain/models/RefreshToken";
import RefreshTokenRepository from "../../../domain/respository/RefreshTokenRepository";
import CustomError from "../../../error/CustomError";
import { throwErrs } from "../../../lib/utils/throwErrs";
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
      throwErrs(err);
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
      throwErrs(err);
    }
  };

  public getAll = async (): Promise<RefreshTokenEntity[]> => {
    try {
      const foundRefreshTokens: RefreshTokenModel[] =
        await RefreshTokenModel.findAll();
      const refreshTokens: RefreshTokenEntity[] = [];
      if (!foundRefreshTokens) return refreshTokens;
      foundRefreshTokens.forEach((foundRefreshToken: RefreshTokenModel) => {
        const token = new RefreshTokenEntity(
          foundRefreshToken.id,
          foundRefreshToken.userId,
          foundRefreshToken.token,
          foundRefreshToken.expiresAt,
          foundRefreshToken.createdAt,
          foundRefreshToken.updatedAt
        );
        refreshTokens.push(token);
      });
      return refreshTokens;
    } catch (err) {
      throwErrs(err);
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
      throwErrs(err);
    }
  };

  public delete = async (userId: number): Promise<void> => {
    try {
      await RefreshTokenModel.destroy({ where: { userId } });
    } catch (err) {
      throwErrs(err);
    }
  };
}
