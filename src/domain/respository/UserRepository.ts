import UserEntity from "../../infrastructure/persistence/entities/UserEntity";
import User from "../models/User";

export default interface UserRepository {
  save(user: User): Promise<void>;
  getById(id: number): Promise<UserEntity | null>;
  getByEmail(email: string): Promise<UserEntity | null>;
  getAll(): Promise<UserEntity[]>;
  update(id: number, user: User): Promise<void>;
  delete(id: number): Promise<void>;
}
