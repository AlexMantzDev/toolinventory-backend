import ResetTokenEntity from "../../infrastructure/persistence/entities/ResetTokenEntity";
import ResetToken from "../models/ResetToken";

export default interface ResetTokenRepository {
  save(resetToken: ResetToken): Promise<void>;
  getAll(): Promise<ResetTokenEntity[]>;
  getByUserId(userId: number): Promise<ResetTokenEntity | null>;
  update(token: string, resetToken: ResetToken): Promise<void>;
  delete(userId: number): Promise<void>;
}
