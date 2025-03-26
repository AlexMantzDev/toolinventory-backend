import ResetToken from "../../domain/models/ResetToken";
import NotFoundError from "../../error/NotFoundError";
import ResetTokenEntity from "../../infrastructure/persistence/entities/ResetTokenEntity";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Email } from "../../lib/utils/createEmail";
import UserRepository from "../../domain/respository/UserRepository";
import ResetTokenRepository from "../../domain/respository/ResetTokenRepository";
import { throwErrs } from "../../lib/utils/throwErrs";
import CustomError from "../../error/CustomError";

const RESET_SECRET = process.env.RESET_SECRET!;

export default class ResetTokenService {
  constructor(
    private resetTokenRepository: ResetTokenRepository,
    private userRepository: UserRepository
  ) {}

  private createResetTokenString = (userId: number) => {
    const ResetTokenString = jwt.sign(
      {
        sub: userId,
        iat: Date.now(),
        scope: "reset_token",
      },
      RESET_SECRET,
      { expiresIn: "15min" }
    );
    return ResetTokenString;
  };

  public issueNewResetToken = async (email: Email): Promise<string> => {
    try {
      const user = await this.userRepository.getByEmail(email);
      if (!user) {
        throw new CustomError("Invalid email.", 400);
      }
      const oldToken: ResetTokenEntity | null =
        await this.resetTokenRepository.getByUserId(user.getId());
      const exp = new Date(Date.now() + 15 * 60 * 1000); //15min
      const token = this.createResetTokenString(user.getId());
      const saltRounds = 10;
      const hashedToken = await bcrypt.hash(token, saltRounds);
      const resetToken = new ResetToken(user.getId(), hashedToken, exp);
      if (oldToken) {
        await this.resetTokenRepository.update(oldToken.getToken(), resetToken);
      } else {
        await this.resetTokenRepository.save(resetToken);
      }
      return token;
    } catch (err) {
      throwErrs(err);
    }
  };

  public deleteResetTokenEntry = async (userId: number): Promise<void> => {
    try {
      await this.resetTokenRepository.delete(userId);
    } catch (err) {
      throwErrs(err);
    }
  };

  public findAllEntries = async (): Promise<ResetTokenEntity[]> => {
    try {
      return await this.resetTokenRepository.getAll();
    } catch (err) {
      throwErrs(err);
    }
  };

  public findEntryByUserId = async (
    userId: number
  ): Promise<ResetTokenEntity> => {
    try {
      const foundResetToken = await this.resetTokenRepository.getByUserId(
        userId
      );
      if (!foundResetToken) {
        throw new NotFoundError(
          "Could not find refresh token with user id: " + userId
        );
      }
      return foundResetToken;
    } catch (err) {
      throwErrs(err);
    }
  };
}
