import ResetToken from "../../../domain/models/ResetToken";
import ResetTokenRepository from "../../../domain/respository/ResetTokenRepository";
import CustomError from "../../../error/CustomError";
import { throwErrs } from "../../../lib/utils/throwErrs";
import ResetTokenModel from "../../sequelize/models/ResetTokenModel";
import ResetTokenEntity from "../entities/ResetTokenEntity";

export default class ResetTokenRepositoryImplSequelize
  implements ResetTokenRepository
{
  constructor() {}
  public save = async (resetToken: ResetToken): Promise<void> => {
    try {
      await ResetTokenModel.create({
        userId: resetToken.getUserId(),
        token: resetToken.getToken(),
        expiresAt: resetToken.getExpiresAt(),
      });
    } catch (err) {
      throwErrs(err);
    }
  };

  public getByUserId = async (
    userId: number
  ): Promise<ResetTokenEntity | null> => {
    try {
      const foundResetToken: ResetTokenModel | null =
        await ResetTokenModel.findOne({
          where: { userId },
        });
      if (!foundResetToken) {
        return null;
      }
      const resetTokenEntity = new ResetTokenEntity(
        foundResetToken.id,
        foundResetToken.userId,
        foundResetToken.token,
        foundResetToken.expiresAt,
        foundResetToken.createdAt,
        foundResetToken.updatedAt
      );
      return resetTokenEntity;
    } catch (err) {
      throwErrs(err);
    }
  };

  public getAll = async (): Promise<ResetTokenEntity[]> => {
    try {
      const foundResetTokens: ResetTokenModel[] =
        await ResetTokenModel.findAll();
      const ResetTokens: ResetTokenEntity[] = [];
      if (!foundResetTokens) return ResetTokens;
      foundResetTokens.forEach((foundResetToken: ResetTokenModel) => {
        const token = new ResetTokenEntity(
          foundResetToken.id,
          foundResetToken.userId,
          foundResetToken.token,
          foundResetToken.expiresAt,
          foundResetToken.createdAt,
          foundResetToken.updatedAt
        );
        ResetTokens.push(token);
      });
      return ResetTokens;
    } catch (err) {
      throwErrs(err);
    }
  };

  public update = async (
    token: string,
    resetToken: ResetToken
  ): Promise<void> => {
    try {
      const [updatedRows] = await ResetTokenModel.update(resetToken, {
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
      const rowCount = await ResetTokenModel.destroy({ where: { userId } });
      if (rowCount === 0) {
        throw new CustomError("Delete operation did not complete.", 500);
      }
    } catch (err) {
      throwErrs(err);
    }
  };
}
