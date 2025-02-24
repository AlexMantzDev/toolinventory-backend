import VerifyTokenEntity from "../../infrastructure/persistence/entities/VerifyTokenEntity";
import VerifyToken from "../models/VerifyToken";

export default interface VerifyTokenRepository {
  save(verifyToken: VerifyToken): Promise<void>;
  getAll(): Promise<VerifyTokenEntity[]>;
  getByUserId(userId: number): Promise<VerifyTokenEntity | null>;
  update(token: string, verifyToken: VerifyToken): Promise<void>;
  delete(userId: number): Promise<void>;
}
