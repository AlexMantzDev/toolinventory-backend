import RefreshTokenEntity from "../../infrastructure/persistence/entities/RefreshTokenEntity";
import RefreshToken from "../models/RefreshToken";

export default interface RefreshTokenRepository {
  save(refreshToken: RefreshToken): Promise<void>;
  getAll(): Promise<RefreshTokenEntity[]>;
  update(token: string, refreshToken: RefreshToken): Promise<void>;
  delete(userId: number): Promise<void>;
}
