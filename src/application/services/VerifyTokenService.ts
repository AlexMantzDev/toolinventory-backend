import VerifyToken from "../../domain/models/VerifyToken";
import NotFoundError from "../../error/NotFoundError";
import VerifyTokenEntity from "../../infrastructure/persistence/entities/VerifyTokenEntity";
import VerifyTokenRepositoryImplSequelize from "../../infrastructure/persistence/repository-impls/VerifyTokenRepositoryImplSequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { throwErrs } from "../../lib/utils/throwErrs";

const VERIFY_SECRET = process.env.VERIFY_SECRET!;

export default class VerifyTokenService {
  constructor(
    private verifyTokenRepository: VerifyTokenRepositoryImplSequelize
  ) {}

  private createVerifyTokenString = (userId: number) => {
    const VerifyTokenString = jwt.sign(
      {
        sub: userId,
        iat: Date.now(),
        scope: "verify_token",
      },
      VERIFY_SECRET,
      { expiresIn: "1h" }
    );
    return VerifyTokenString;
  };

  public issueNewVerifyToken = async (userId: number): Promise<string> => {
    try {
      const oldToken: VerifyTokenEntity | null =
        await this.verifyTokenRepository.getByUserId(userId);
      const exp = new Date(Date.now() + 60 * 60 * 1000); //1h
      const token = this.createVerifyTokenString(userId);
      const saltRounds = 10;
      const hashedToken = await bcrypt.hash(token, saltRounds);
      const verifyToken = new VerifyToken(userId, hashedToken, exp);
      if (oldToken) {
        await this.verifyTokenRepository.update(
          oldToken.getToken(),
          verifyToken
        );
      } else {
        await this.verifyTokenRepository.save(verifyToken);
      }
      return token;
    } catch (err) {
      throwErrs(err);
    }
  };

  public deleteVerifyTokenEntry = async (userId: number): Promise<void> => {
    try {
      await this.verifyTokenRepository.delete(userId);
    } catch (err) {
      throwErrs(err);
    }
  };

  public findAllEntries = async (): Promise<VerifyTokenEntity[]> => {
    try {
      return await this.verifyTokenRepository.getAll();
    } catch (err) {
      throwErrs(err);
    }
  };

  public findEntryByUserId = async (
    userId: number
  ): Promise<VerifyTokenEntity> => {
    try {
      const foundVerifyToken = await this.verifyTokenRepository.getByUserId(
        userId
      );
      if (!foundVerifyToken) {
        throw new NotFoundError(
          "Could not find refresh token with user id: " + userId
        );
      }
      return foundVerifyToken;
    } catch (err) {
      throwErrs(err);
    }
  };
}
