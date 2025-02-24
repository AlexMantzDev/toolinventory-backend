import VerifyToken from "../../../domain/models/VerifyToken";
import VerifyTokenRepository from "../../../domain/respository/VerifyTokenRepository";
import CustomError from "../../../error/CustomError";
import InternalServerError from "../../../error/InternalServerError";
import { throwErrs } from "../../../lib/utils/throwErrs";
import VerifyTokenModel from "../../sequelize/models/VerifyTokenModel";
import VerifyTokenEntity from "../entities/VerifyTokenEntity";

export default class VerifyTokenRepositoryImplSequelize
  implements VerifyTokenRepository
{
  constructor() {}
  public save = async (verifyToken: VerifyToken): Promise<void> => {
    try {
      await VerifyTokenModel.create({
        userId: verifyToken.getUserId(),
        token: verifyToken.getToken(),
        expiresAt: verifyToken.getExpiresAt(),
      });
    } catch (err) {
      throwErrs(err);
    }
  };

  public getByUserId = async (
    userId: number
  ): Promise<VerifyTokenEntity | null> => {
    try {
      const foundVerifyToken: VerifyTokenModel | null =
        await VerifyTokenModel.findOne({
          where: { userId },
        });
      if (!foundVerifyToken) {
        return null;
      }
      const verifyTokenEntity = new VerifyTokenEntity(
        foundVerifyToken.id,
        foundVerifyToken.userId,
        foundVerifyToken.token,
        foundVerifyToken.expiresAt,
        foundVerifyToken.createdAt,
        foundVerifyToken.updatedAt
      );
      return verifyTokenEntity;
    } catch (err) {
      throwErrs(err);
    }
  };

  public getAll = async (): Promise<VerifyTokenEntity[]> => {
    try {
      const foundVerifyTokens: VerifyTokenModel[] =
        await VerifyTokenModel.findAll();
      const VerifyTokens: VerifyTokenEntity[] = [];
      if (!foundVerifyTokens) return VerifyTokens;
      foundVerifyTokens.forEach((foundVerifyToken: VerifyTokenModel) => {
        const token = new VerifyTokenEntity(
          foundVerifyToken.id,
          foundVerifyToken.userId,
          foundVerifyToken.token,
          foundVerifyToken.expiresAt,
          foundVerifyToken.createdAt,
          foundVerifyToken.updatedAt
        );
        VerifyTokens.push(token);
      });
      return VerifyTokens;
    } catch (err) {
      throwErrs(err);
    }
  };

  public update = async (
    token: string,
    verifyToken: VerifyToken
  ): Promise<void> => {
    try {
      const [updatedRows] = await VerifyTokenModel.update(verifyToken, {
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
      const rowCount = await VerifyTokenModel.destroy({ where: { userId } });
      if (rowCount === 0) {
        throw new CustomError("Delete operation did not complete.", 500);
      }
    } catch (err) {
      throwErrs(err);
    }
  };
}
