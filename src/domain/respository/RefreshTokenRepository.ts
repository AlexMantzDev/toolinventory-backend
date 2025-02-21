import RefreshTokenEntity from "../../infrastructure/persistence/entities/RefreshTokenEntity";
import RefreshToken from "../models/RefreshToken";

export default interface RefreshTokenRepository {
  save(refreshToken: RefreshToken): Promise<void>;
  getByTokenString(token: string): Promise<RefreshTokenEntity | null>;
  getAll(): Promise<RefreshTokenEntity[]>;
  update(token: string, refreshToken: RefreshToken): Promise<void>;
  delete(token: string): Promise<void>;
}
