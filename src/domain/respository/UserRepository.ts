import UserEntity from "../../infrastructure/persistence/entities/UserEntity";
import { Email } from "../../lib/utils/createEmail";
import User from "../models/User";

export default interface UserRepository {
  save(user: User): Promise<void>;
  getById(id: number): Promise<UserEntity | null>;
  getByEmail(email: Email): Promise<UserEntity | null>;
  getAll(): Promise<UserEntity[]>;
  deny(id: number): Promise<void>;
  permit(id: number): Promise<void>;
  update(email: Email, user: User): Promise<void>;
  delete(id: number): Promise<void>;
}
